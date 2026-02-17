import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ToolsPage from './pages/ToolsPage'
import ToolDetailPage from './pages/ToolDetailPage'
import BlogListPage from './pages/BlogListPage'
import BlogDetailPage from './pages/BlogDetailPage'
import InfoPage from './pages/InfoPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tools', element: <ToolsPage /> },
      { path: 'tools/:slug', element: <ToolDetailPage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogDetailPage /> },
      { path: 'pages/:slug', element: <InfoPage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
