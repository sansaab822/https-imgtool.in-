import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link className="brand" to="/">ImageConvert (React)</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/pages/about-us">About</Link>
          <Link to="/pages/contact-us">Contact</Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="container">Website migrated to React with reusable routes and components.</div>
      </footer>
    </>
  )
}
