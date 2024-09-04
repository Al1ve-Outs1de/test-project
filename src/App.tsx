import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PostsPage from './pages/posts/posts'
import PostPage from './pages/post/post'
import CreatePostPage from './pages/create-post/create-post'
import './App.css'
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PostsPage />} />
        <Route path='/post/:id' element={<PostPage />} />
        <Route path='/create-post' element={<CreatePostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
