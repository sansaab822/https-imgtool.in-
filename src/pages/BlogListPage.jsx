import { Link } from 'react-router-dom'
import { blogs } from '../data/blogs'

export default function BlogListPage() {
  return (
    <div className="container page">
      <h1>Blog</h1>
      <div className="grid">
        {blogs.map((post) => (
          <Link className="card" key={post.slug} to={`/blog/${post.slug}`}>
            <h3>{post.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
