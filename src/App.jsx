import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashbord from './pages/Dashbord'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import RemoveObject from './pages/RemoveObject'
import { useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'

const App = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const setAuthHeader = async () => {
      try {
        const token = await getToken();
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("✅ Token u vendos te axios");
        }
      } catch (err) {
        console.error("❌ Nuk mora dot token:", err);
      }
    };

    setAuthHeader();
  }, [getToken]);

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashbord />} />
          <Route path='Write-article' element={<WriteArticle />} />
          <Route path='Blog-titles' element={<BlogTitles />} />
          <Route path='Generate-images' element={<GenerateImages />} />
          <Route path='Remove-background' element={<RemoveBackground />} />
          <Route path='Remove-object' element={<RemoveObject />} />
          <Route path='Review-resume' element={<ReviewResume />} />
          <Route path='Community' element={<Community />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
