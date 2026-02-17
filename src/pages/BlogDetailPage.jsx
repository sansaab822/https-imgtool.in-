import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blogs } from '../data/blogs'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const post = useMemo(() => blogs.find((b) => b.slug === slug), [slug])

  if (!post) return <div className="container page"><h1>Post not found</h1></div>

  return (
    <div className="container page">
      <h1>{post.title}</h1>
      <p>This blog page has been moved into a React route. You can now migrate full article content into markdown or CMS-driven components.</p>
      <p><Link to="/blog">← Back to blog</Link></p>
    </div>
  )
}
