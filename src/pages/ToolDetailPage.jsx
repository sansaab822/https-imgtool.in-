import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { tools } from '../data/tools'

export default function ToolDetailPage() {
  const { slug } = useParams()
  const tool = useMemo(() => tools.find((t) => t.slug === slug), [slug])

  if (!tool) {
    return <div className="container page"><h1>Tool not found</h1></div>
  }

  return (
    <div className="container page">
      <div className="tool-header">
        <div>
          <h1>{tool.title}</h1>
          <p>This page is now a reusable React route for <strong>{slug}</strong>.</p>
        </div>
        <span className="badge">React Converted</span>
      </div>
      <div className="card">
        <h3>Upload file</h3>
        <input type="file" />
        <p>Note: Converter logic can now be plugged into this shared React tool template.</p>
      </div>
      <p style={{ marginTop: '1rem' }}><Link to="/tools">← Back to all tools</Link></p>
    </div>
  )
}
