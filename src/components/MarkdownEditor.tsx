import { memo, useCallback } from 'react'
import Editor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  uniqueId?: string
}

// 配置marked以支持代码高亮
const renderer = new marked.Renderer()
renderer.code = function(code, language) {
  const lang = language || ''
  let highlighted = ''
  
  if (lang && hljs.getLanguage(lang)) {
    highlighted = hljs.highlight(code, { language: lang }).value
  } else {
    highlighted = hljs.highlightAuto(code).value
  }
  
  return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
}

marked.setOptions({
  renderer: renderer
})

// 使用 useCallback 稳定 onChange，避免不必要重渲染
const MarkdownEditor = memo(({ value, onChange }: MarkdownEditorProps) => {
  const handleChange = useCallback(
    ({ text }: { text: string }) => {
      onChange(text)
    },
    [onChange]
  )

  const renderMarkdown = useCallback((text: string) => {
    // 处理数学公式
    let processedText = text
    
    // 处理块级公式: $$...$$
    processedText = processedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
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
    processedText = processedText.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: false
        })
      } catch (error) {
        return match
      }
    })
    
    return marked(processedText)
  }, [])

  return (
    <Editor
      value={value}
      onChange={handleChange}
      renderHTML={renderMarkdown}
      placeholder="请输入内容..."
      style={{ height: '500px' }}
    />
  )
})

MarkdownEditor.displayName = 'MarkdownEditor'

export default MarkdownEditor