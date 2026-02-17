import { Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { blogs } from '../data/blogs'

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <h1>Your complete website is now powered by React</h1>
        <p>All major sections (home, tools, blog, and info pages) are routed via React Router and rendered through reusable components.</p>
      </section>
      <section className="section">
        <h2>Popular tools</h2>
        <div className="grid">
          {tools.slice(0, 12).map((tool) => (
            <Link className="card" key={tool.slug} to={`/tools/${tool.slug}`}>
              <h3>{tool.title}</h3>
              <p>Open converter page</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Latest blog posts</h2>
        <div className="grid">
          {blogs.map((blog) => (
            <Link className="card" key={blog.slug} to={`/blog/${blog.slug}`}>
              <h3>{blog.title}</h3>
              <p>Read article</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
