import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { pages } from '../data/pages'

export default function InfoPage() {
  const { slug } = useParams()
  const page = useMemo(() => pages.find((p) => p.slug === slug), [slug])

  if (!page) return <div className="container page"><h1>Page not found</h1></div>

  return (
    <div className="container page">
      <h1>{page.title}</h1>
      <p>This static page has been converted to a React-driven route ({slug}).</p>
      <p><Link to="/">← Go home</Link></p>
    </div>
  )
}
