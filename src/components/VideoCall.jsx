import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import './VideoCall.css'

const VideoCall = () => {
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    socketRef.current = io(API_URL)
    
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
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // Create peer connection
      const pc = createPeerConnection()
      peerConnectionRef.current = pc
      
      // Add local stream tracks
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })
      
      // Join call room
      socketRef.current.emit('join-call', 'user')
      
      // Create offer
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
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // Create peer connection
      const pc = createPeerConnection()
      peerConnectionRef.current = pc
      
      // Add local stream tracks
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })
      
      // Set remote description
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      
      // Create answer
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
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    // Notify other user
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
    <div className="video-call-container">
      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <motion.div
        className="video-call-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="page-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Video Call 📹
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          See your love face to face 💕
        </motion.p>

        {/* Video Container */}
        <div className="video-container">
          {/* Remote Video (Full Size) */}
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
                    <p>Waiting for your love to join...</p>
                    <p className="waiting-hint">Ask them to open the Video Call page</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Local Video (Picture in Picture) */}
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

        {/* Status Indicator */}
        {isCallActive && (
          <div className="call-status">
            <span className="status-dot active"></span>
            <span>Connected</span>
          </div>
        )}

        {/* Controls */}
        <div className="call-controls">
          {!isCallActive ? (
            <motion.button
              className="start-call-btn"
              onClick={startCall}
              disabled={isConnecting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isConnecting ? 'Connecting...' : '📹 Start Video Call'}
            </motion.button>
          ) : (
            <>
              <motion.button
                className={`control-btn ${isMuted ? 'active' : ''}`}
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🎤'}
              </motion.button>
              
              <motion.button
                className={`control-btn ${isVideoOff ? 'active' : ''}`}
                onClick={toggleVideo}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
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

        {/* Tips */}
        {!isCallActive && (
          <motion.div
            className="call-tips"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3>💡 Tips for the best experience:</h3>
            <ul>
              <li>Make sure you're in a well-lit room</li>
              <li>Use headphones for better audio quality</li>
              <li>Find a quiet place without background noise</li>
              <li>Both of you need to open this page to connect</li>
            </ul>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/" className="nav-button">
            ← Back to Heart Map
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VideoCall
