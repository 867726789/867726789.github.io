import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Article {
  id: string
  title: string
  created_at: string
}

const Archive = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [archivedArticles, setArchivedArticles] = useState<Record<string, Article[]>>({})

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (articles.length > 0) {
      const grouped = articles.reduce((acc, article) => {
        const year = new Date(article.created_at).getFullYear().toString()
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(article)
        return acc
      }, {} as Record<string, Article[]>)
      setArchivedArticles(grouped)
    }
  }, [articles])

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, created_at')
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
      <h1>归档</h1>
      {Object.entries(archivedArticles).map(([year, yearArticles]) => (
        <div key={year} className="archive-year">
          <h2>{year}</h2>
          <ul className="archive-articles">
            {yearArticles.map((article) => (
              <li key={article.id}>
                <Link to={`/article/${article.id}`}>
                  <span>{article.title}</span>
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default Archive