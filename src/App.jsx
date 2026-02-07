import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Memories from './components/Memories'
import Games from './components/Games'
import Letters from './components/Letters'
import Timeline from './components/Timeline'
import Surprises from './components/Surprises'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
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
      </Routes>
    </Router>
  )
}

export default App
