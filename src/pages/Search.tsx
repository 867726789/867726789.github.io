import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Article {
  id: string
  title: string
  author: string
  tags: string[]
  summary: string
  created_at: string
}

const Search = () => {
  const [searchParams] = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      searchArticles()
    }
  }, [query])

  const searchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching articles:', error)
    } else {
      setArticles(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div>搜索中...</div>
  }

  return (
    <div>
      <h1>搜索结果: {query}</h1>
      <div className="article-list">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.id} className="article-card">
              <h2><Link to={`/article/${article.id}`}>{article.title}</Link></h2>
              <p>{article.summary}</p>
              <div className="article-meta">
                <span>作者: {article.author}</span>
                <span>发布时间: {new Date(article.created_at).toLocaleDateString()}</span>
                <span>标签: {article.tags.join(', ')}</span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Link to={`/edit/${article.id}`} className="btn btn-secondary">编辑</Link>
              </div>
            </div>
          ))
        ) : (
          <div>没有找到相关文章</div>
        )}
      </div>
    </div>
  )
}

export default Search