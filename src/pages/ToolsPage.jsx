import { Link } from 'react-router-dom'
import { tools } from '../data/tools'

export default function ToolsPage() {
  return (
    <div className="container page">
      <h1>All Image Tools</h1>
      <div className="grid">
        {tools.map((tool) => (
          <Link className="card" key={tool.slug} to={`/tools/${tool.slug}`}>
            <h3>{tool.title}</h3>
            <p>{tool.slug}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
