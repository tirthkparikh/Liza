import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import './VideoCall.css'

const VideoCall = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('idle')
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const socketRef = useRef(null)
  
  useEffect(() => {
    // Connect to Socket.io
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    socketRef.current = io(BASE_URL)
    
    const socket = socketRef.current
    
    socket.on('user-joined', () => {
      setConnectionStatus('incoming')
    })
    
    socket.on('offer', async (data) => {
      await handleOffer(data)
    })
    
    socket.on('answer', async (data) => {
      await handleAnswer(data)
    })
    
    socket.on('ice-candidate', async (data) => {
      await handleIceCandidate(data)
    })
    
    socket.on('call-ended', () => {
      endCall()
    })
    
    return () => {
      socket.disconnect()
      endCall()
    }
  }, [])
  
  const startCall = async () => {
    try {
      setIsConnecting(true)
      setConnectionStatus('connecting')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      const pc = createPeerConnection()
      peerConnectionRef.current = pc
      
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })
      
      socketRef.current.emit('join-call', 'admin')
      
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      socketRef.current.emit('offer', offer)
      
      setIsCallActive(true)
      setIsConnecting(false)
      setConnectionStatus('connected')
      
    } catch (error) {
      console.error('Error starting call:', error)
      setIsConnecting(false)
      setConnectionStatus('error')
    }
  }
  
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate)
      }
    }
    
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }
    
    return pc
  }
  
  const handleOffer = async (offer) => {
    try {
      setIsConnecting(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      const pc = createPeerConnection()
      peerConnectionRef.current = pc
      
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      
      socketRef.current.emit('answer', answer)
      
      setIsCallActive(true)
      setIsConnecting(false)
      setConnectionStatus('connected')
      
    } catch (error) {
      console.error('Error handling offer:', error)
      setIsConnecting(false)
    }
  }
  
  const handleAnswer = async (answer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      )
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }
  
  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
    }
  }
  
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    if (socketRef.current) {
      socketRef.current.emit('end-call')
    }
    
    setLocalStream(null)
    setRemoteStream(null)
    setIsCallActive(false)
    setIsConnecting(false)
    setConnectionStatus('idle')
    setIsMuted(false)
    setIsVideoOff(false)
  }
  
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }
  
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }
  
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo"><h2>💕 Admin Panel</h2></div>
        <ul className="nav-menu">
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/images">🖼️ Images</Link></li>
          <li><Link to="/blogs">📝 Love Letters</Link></li>
          <li><Link to="/stories">📖 Stories</Link></li>
          <li><Link to="/dates">📅 Dates</Link></li>
          <li><Link to="/lovejar">💝 Love Jar</Link></li>
          <li><Link to="/letters">💌 Write to Liza</Link></li>
          <li><Link to="/games">🎮 Games</Link></li>
          <li className="active"><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
      </nav>

      <main className="main-content video-call-main">
        <div className="video-call-container">
          <div className="video-call-content">
            <h1>Video Call with Liza 📹</h1>
            <p className="subtitle">Connect face to face with your love 💕</p>

            <div className="video-container">
              <div className="remote-video-wrapper">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="remote-video"
                  />
                ) : (
                  <div className="waiting-screen">
                    {isConnecting ? (
                      <div className="connecting-animation">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="spinner"
                        >
                          💕
                        </motion.div>
                        <p>Connecting...</p>
                      </div>
                    ) : (
                      <div className="waiting-message">
                        <span className="waiting-icon">💕</span>
                        <p>Waiting for Liza to join...</p>
                        <p className="waiting-hint">Ask Liza to open Video Call on her device</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="local-video-wrapper">
                {localStream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="local-video"
                  />
                ) : (
                  <div className="local-placeholder">
                    <span>📹</span>
                  </div>
                )}
              </div>
            </div>

            {isCallActive && (
              <div className="call-status">
                <span className="status-dot active"></span>
                <span>Connected with Liza</span>
              </div>
            )}

            <div className="call-controls">
              {!isCallActive ? (
                <motion.button
                  className="start-call-btn"
                  onClick={startCall}
                  disabled={isConnecting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnecting ? 'Connecting...' : '📹 Call Liza'}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    className={`control-btn ${isMuted ? 'active' : ''}`}
                    onClick={toggleMute}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? '🔇' : '🎤'}
                  </motion.button>
                  
                  <motion.button
                    className={`control-btn ${isVideoOff ? 'active' : ''}`}
                    onClick={toggleVideo}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isVideoOff ? '📵' : '📹'}
                  </motion.button>
                  
                  <motion.button
                    className="end-call-btn"
                    onClick={endCall}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    📞 End Call
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VideoCall
