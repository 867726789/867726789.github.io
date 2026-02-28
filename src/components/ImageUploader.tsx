import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface ImageUploaderProps {
  onInsertImage: (imageUrl: string) => void
  articleId?: string
}

const ImageUploader = ({ onInsertImage, articleId }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // 加载已上传的图片
  useEffect(() => {
    if (articleId) {
      loadExistingImages()
    }
  }, [articleId])

  const loadExistingImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .list(`images/${articleId}`)

      if (error) {
        console.error('Error loading images:', error)
        return
      }

      if (data && data.length > 0) {
        const imageUrls = data
          .filter(file => !file.name.startsWith('.'))
          .map(file => {
            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(`images/${articleId}/${file.name}`)
            return publicUrl
          })
        setUploadedImages(imageUrls)
      }
    } catch (error) {
      console.error('Error loading images:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `images/${articleId || 'new'}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      const imageUrl = data.publicUrl
      setUploadedImages(prev => [...prev, imageUrl])
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('图片上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const filePath = imageUrl.split('/images/')[1]
      const { error } = await supabase.storage
        .from('images')
        .remove([`images/${filePath}`])

      if (error) {
        throw error
      }

      setUploadedImages(prev => prev.filter(url => url !== imageUrl))
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('图片删除失败')
    }
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h3>图片管理</h3>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          id="image-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="image-upload" className="btn btn-primary" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
          {uploading ? '上传中...' : '上传图片'}
        </label>
      </div>
      
      {uploadedImages.length > 0 && (
        <div>
          <h4>已上传的图片</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}>
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index}`}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', marginBottom: '0.5rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onInsertImage(imageUrl)}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                  >
                    插入
                  </button>
                  <button
                    onClick={() => handleDeleteImage(imageUrl)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader