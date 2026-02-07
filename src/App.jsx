import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Memories from './components/Memories'
import Games from './components/Games'
import TicTacToe from './components/TicTacToe'
import ConnectFour from './components/ConnectFour'
import RockPaperScissors from './components/RockPaperScissors'
import VideoCall from './components/VideoCall'
import Letters from './components/Letters'
import Timeline from './components/Timeline'
import Surprises from './components/Surprises'
import DatePlanner from './components/DatePlanner'
import RomanticCorner from './components/RomanticCorner'
import LoveJar from './components/LoveJar'
import LoveNotifications from './components/LoveNotifications'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated')
    if (storedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      {isAuthenticated && <LoveNotifications />}
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/memories" 
          element={isAuthenticated ? <Memories /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/games" 
          element={isAuthenticated ? <Games /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/letters" 
          element={isAuthenticated ? <Letters /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/timeline" 
          element={isAuthenticated ? <Timeline /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/surprises" 
          element={isAuthenticated ? <Surprises /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dates" 
          element={isAuthenticated ? <DatePlanner /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/romantic" 
          element={isAuthenticated ? <RomanticCorner /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/lovejar" 
          element={isAuthenticated ? <LoveJar /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/videocall" 
          element={isAuthenticated ? <VideoCall /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/games/tictactoe" 
          element={isAuthenticated ? <TicTacToe /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/games/connectfour" 
          element={isAuthenticated ? <ConnectFour /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/games/rps" 
          element={isAuthenticated ? <RockPaperScissors /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  )
}

export default App
