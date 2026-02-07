import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getLoveJarNotes, createLoveJarNote } from '../utils/api'
import './LoveJar.css'

const LoveJar = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [author, setAuthor] = useState('admin')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [jarShaking, setJarShaking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const data = await getLoveJarNotes()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    
    const colors = ['#ff6b9d', '#ffd93d', '#6bcf7f', '#a855f7', '#3b82f6', '#f97316']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    
    try {
      await createLoveJarNote({
        text: newNote,
        color: randomColor
      })
      
      setNewNote('')
      setShowAddForm(false)
      fetchNotes()
      
      // Shake the jar
      setJarShaking(true)
      setTimeout(() => setJarShaking(false), 500)
      
      alert('Love note added! 💕')
    } catch (error) {
      alert('Error saving note. Please try again.')
    }
  }

  const pickRandomNote = () => {
    if (notes.length === 0) return
    const randomNote = notes[Math.floor(Math.random() * notes.length)]
    setSelectedNote(randomNote)
  }

  const getAuthorName = (author) => {
    return author === 'admin' ? 'Tirth' : 'Liza'
  }

  return (
    <div className="love-jar-container">
      <div className="floating-hearts">
        {[...Array(20)].map((_, i) => (
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
        className="love-jar-content"
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
          Our Love Jar 💝
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Fill our jar with love notes for each other!
        </motion.p>

        {/* Jar Display */}
        <motion.div
          className={`jar-container ${jarShaking ? 'shake' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="jar">
            <div className="jar-lid">
              <span className="jar-emoji">🏺</span>
            </div>
            <div className="jar-body">
              <div className="notes-count">
                <span className="count-number">{notes.length}</span>
                <span className="count-label">Love Notes</span>
              </div>
              <div className="jar-hearts">
                {[...Array(Math.min(notes.length, 10))].map((_, i) => (
                  <motion.span
                    key={i}
                    className="jar-heart"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      bottom: `${10 + Math.random() * 70}%`,
                      fontSize: `${15 + Math.random() * 15}px`
                    }}
                  >
                    💕
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="jar-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="action-btn pick-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={pickRandomNote}
            disabled={notes.length === 0}
          >
            🎲 Pick a Random Note
          </motion.button>
          <motion.button
            className="action-btn add-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
          >
            ✨ Add Love Note
          </motion.button>
        </motion.div>

        {/* Add Note Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="note-form-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                className="note-form"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>💝 Write a Love Note</h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write something sweet..."
                  rows="4"
                  maxLength="200"
                />
                <div className="char-count">{newNote.length}/200</div>
                <div className="author-select">
                  <label>From:</label>
                  <select value={author} onChange={(e) => setAuthor(e.target.value)}>
                    <option value="admin">Tirth (You)</option>
                    <option value="lover">Liza</option>
                  </select>
                </div>
                <div className="form-buttons">
                  <button className="save-btn" onClick={addNote} disabled={!newNote.trim()}>
                    💌 Save Note
                  </button>
                  <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Note Display */}
        <AnimatePresence>
          {selectedNote && (
            <motion.div
              className="selected-note-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNote(null)}
            >
              <motion.div
                className="selected-note"
                style={{ background: selectedNote.color }}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="note-text">{selectedNote.text}</p>
                <div className="note-meta">
                  <span className="note-author">— {getAuthorName(selectedNote.author)}</span>
                  <span className="note-date">
                    {new Date(selectedNote.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Notes Preview */}
        {!loading && notes.length > 0 && (
          <motion.div
            className="notes-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>All Notes ({notes.length})</h3>
            <div className="notes-grid">
              {notes.slice(0, 6).map((note, index) => (
                <motion.div
                  key={note._id}
                  className={`note-preview ${note.author === 'lover' ? 'from-lover' : ''}`}
                  style={{ background: note.color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedNote(note)}
                  whileHover={{ scale: 1.05, rotate: Math.random() * 6 - 3 }}
                >
                  <p className="preview-text">{note.text.substring(0, 50)}...</p>
                  <span className="preview-author">
                    {getAuthorName(note.author)}
                    {note.author === 'lover' && ' 💕'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/" className="nav-button">
            ← Back to Heart Map
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoveJar
