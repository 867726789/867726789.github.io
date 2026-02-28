import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

const Edit = () => {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      setTitle(data.title)
      setContent(data.content)
      setTags(data.tags.join(','))
      setCategory(data.category_id)
      setSummary(data.summary)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)

    if (id) {
      // 更新文章
      const { error } = await supabase
        .from('articles')
        .update({
          title,
          content,
          tags: tagsArray,
          category_id: category,
          summary
        })
        .eq('id', id)

      if (error) {
        setError(error.message)
      } else {
        navigate(`/article/${id}`)
      }
    } else {
      // 创建新文章
      const { error } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          author: '作者', // 这里可以从用户信息中获取
          tags: tagsArray,
          category_id: category,
          summary
        })

      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    }

    setLoading(false)
  }

  return (
    <div className="article-content">
      <h2>{id ? '编辑文章' : '写文章'}</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容</label>
          <SimpleMDE
            value={content}
            onChange={setContent}
            options={{
              spellChecker: false,
              autosave: { enabled: true, uniqueId: id || 'new-article' }
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">标签 (用逗号分隔)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">分类</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">简介</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}

export default Edit