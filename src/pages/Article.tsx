import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Article {
  id: string
  title: string
  content: string
  author: string
  tags: string[]
  category_id: string
  summary: string
  created_at: string
}

const Article = () => {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
    } else {
      setArticle(data)
    }
    setLoading(false)
  }

  const renderMarkdown = (content: string) => {
    // 配置marked支持代码块高亮
    marked.setOptions({
      highlight: function(code: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value
        }
        return hljs.highlightAuto(code).value
      }
    } as any)
    
    // 处理数学公式
    let processedContent = content
    
    // 处理块级公式: $$...$$
    processedContent = processedContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: true
        })
      } catch (error) {
        return match
      }
    })
    
    // 处理行内公式: $...$ (避免匹配到已处理的块级公式)
    processedContent = processedContent.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: false
        })
      } catch (error) {
        return match
      }
    })
    
    return { __html: marked(processedContent) }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  if (!article) {
    return <div>文章不存在</div>
  }

  return (
    <div className="article-content">
      <h1>{article.title}</h1>
      <div className="article-meta">
        <span>作者: {article.author}</span>
        <span>发布时间: {new Date(article.created_at).toLocaleDateString()}</span>
        <span>标签: {article.tags.join(', ')}</span>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to={`/edit/${article.id}`} className="btn btn-primary">编辑文章</Link>
      </div>
      <div dangerouslySetInnerHTML={renderMarkdown(article.content)} />
    </div>
  )
}

export default Article