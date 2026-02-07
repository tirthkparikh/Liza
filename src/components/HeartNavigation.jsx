import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './HeartNavigation.css';

const HeartNavigation = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 'memories', label: 'Memories', emoji: '📸', color: '#ff6b9d' },
    { id: 'letters', label: 'Letters', emoji: '💌', color: '#764ba2' },
    { id: 'timeline', label: 'Our Story', emoji: '📖', color: '#667eea' },
    { id: 'dates', label: 'Dates', emoji: '💕', color: '#f093fb' },
    { id: 'romantic', label: 'Romantic', emoji: '🌹', color: '#ff4081' },
    { id: 'surprises', label: 'Surprises', emoji: '🎁', color: '#ff9800' },
    { id: 'lovejar', label: 'Love Jar', emoji: '🫙', color: '#ffca28' },
  ];

  // Heart shape coordinates (relative to center)
  const heartPositions = [
    { x: -150, y: -180 }, // memories - top left
    { x: 0, y: -120 },    // letters - top center
    { x: 150, y: -180 },  // timeline - top right
    { x: -100, y: -40 },  // dates - left curve
    { x: 100, y: -40 },   // romantic - right curve
    { x: -60, y: 60 },    // surprises - left bottom
    { x: 60, y: 60 },     // lovejar - right bottom
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Heart Menu Button */}
      <motion.button
        className="heart-menu-btn"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 20, 147, 0.4)',
            '0 0 40px rgba(255, 20, 147, 0.6)',
            '0 0 20px rgba(255, 20, 147, 0.4)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="heart-icon">{isOpen ? '✕' : '💖'}</span>
      </motion.button>

      {/* Heart-Shaped Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="heart-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Heart Shape Background */}
            <div className="heart-shape-container">
              <svg className="heart-outline" viewBox="-200 -250 400 500">
                <path
                  d="M 0 -200 C -100 -200 -180 -120 -180 0 C -180 100 -100 180 0 250 C 100 180 180 100 180 0 C 180 -120 100 -200 0 -200"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="10,5"
                />
              </svg>

              {/* Navigation Items in Heart Shape */}
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="heart-nav-item"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: heartPositions[index].x,
                    y: heartPositions[index].y,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 200
                  }}
                >
                  <Link 
                    to={`/${item.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className={location.pathname === `/${item.id}` ? 'active' : ''}
                  >
                    <motion.div
                      className="nav-item-content"
                      style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: `0 0 30px ${item.color}80`
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="nav-emoji">{item.emoji}</span>
                      <span className="nav-label">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              {/* Center Heart */}
              <motion.div
                className="center-heart"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              >
                <Link to="/" onClick={(e) => e.stopPropagation()}>
                  <motion.span
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💖
                  </motion.span>
                  <span className="center-label">Home</span>
                </Link>
              </motion.div>
            </div>

            {/* Logout Button */}
            <motion.button
              className="nav-logout-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeartNavigation;
