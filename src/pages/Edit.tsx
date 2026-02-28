import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import MarkdownEditor from '../components/MarkdownEditor'
import ImageUploader from '../components/ImageUploader'

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

  // 缓存 onChange 函数，减少不必要的重新渲染
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])

  const handleContentChange = useCallback((value: string) => {
    setContent(value)
  }, [])

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value)
  }, [])

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value)
  }, [])

  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value)
  }, [])

  const handleInsertImage = useCallback((imageUrl: string) => {
    const imageMarkdown = `
![图片](${imageUrl})
`
    setContent(prev => prev + imageMarkdown)
  }, [])

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
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容</label>
          <MarkdownEditor
            value={content}
            onChange={handleContentChange}
            uniqueId={id || 'new-article'}
          />
          <ImageUploader
            onInsertImage={handleInsertImage}
            articleId={id}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">标签 (用逗号分隔)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={handleTagsChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">分类</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">简介</label>
          <textarea
            id="summary"
            value={summary}
            onChange={handleSummaryChange}
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