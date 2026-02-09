import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Images from './components/Images'
import Blogs from './components/Blogs'
import Stories from './components/Stories'
import Dates from './components/Dates'
import LoveJar from './components/LoveJar'
import VideoCall from './components/VideoCall'
import Letters from './components/Letters'
import Messages from './components/Messages'
import Games from './components/Games'
import TicTacToe from './components/TicTacToe'
// import ConnectFour from './components/ConnectFour'
// import RockPaperScissors from './components/RockPaperScissors'
import './App.css'

const RAW_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001'

const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '')

const API_URL = `${API_BASE_URL}/api`


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (newToken) => {
    setToken(newToken)
    setIsAuthenticated(true)
    localStorage.setItem('admin_token', newToken)
  }

  const handleLogout = () => {
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('admin_token')
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/" /> : 
            <Login onLogin={handleLogin} API_URL={API_URL} />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/images" 
          element={
            isAuthenticated ? 
            <Images token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/blogs" 
          element={
            isAuthenticated ? 
            <Blogs token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/stories" 
          element={
            isAuthenticated ? 
            <Stories token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/dates" 
          element={
            isAuthenticated ? 
            <Dates token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/lovejar" 
          element={
            isAuthenticated ? 
            <LoveJar token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/videocall" 
          element={
            isAuthenticated ? 
            <VideoCall token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/letters" 
          element={
            isAuthenticated ? 
            <Letters token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/messages" 
          element={
            isAuthenticated ? 
            <Messages token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/games" 
          element={
            isAuthenticated ? 
            <Games token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/games/tictactoe" 
          element={
            isAuthenticated ? 
            <TicTacToe token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        />
        {/* <Route 
          path="/games/connectfour" 
          element={
            isAuthenticated ? 
            <ConnectFour token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        /> */}
        {/* <Route 
          path="/games/rps" 
          element={
            isAuthenticated ? 
            <RockPaperScissors token={token} API_URL={API_URL} /> : 
            <Navigate to="/login" />
          } 
        /> */}
      </Routes>
    </Router>
  )
}

export default App

