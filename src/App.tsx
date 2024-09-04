import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import PostsPage from './pages/posts/posts'
import PostPage from './pages/post/post'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PostsPage />} />
        <Route path='/post/:id' element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
