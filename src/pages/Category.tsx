import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Article {
  id: string
  title: string
  created_at: string
}

const Category = () => {
  const { id } = useParams<{ id: string }>()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchArticles()
    }
  }, [id])

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, created_at')
      .eq('category_id', id)
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
      <h1>分类: {id}</h1>
      <div className="category-list">
        <div className="category-card">
          <h2>文章列表</h2>
          <ul className="category-articles">
            {articles.map((article) => (
              <li key={article.id}>
                <Link to={`/article/${article.id}`}>
                  {article.title} - {new Date(article.created_at).toLocaleDateString()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Category