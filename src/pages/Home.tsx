import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
    } else {
      setArticles(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="搜索文章..." 
          className="search-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const query = (e.target as HTMLInputElement).value
              window.location.href = `/search?q=${encodeURIComponent(query)}`
            }
          }}
        />
      </div>
      <div className="article-list">
        {articles.map((article) => (
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
        ))}
      </div>
    </div>
  )
}

export default Home