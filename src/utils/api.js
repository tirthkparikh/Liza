// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export const API_URL = `${API_BASE_URL}/api`

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('admin_token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Get images from API
export const getImages = async () => {
  try {
    const response = await fetch(`${API_URL}/images`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching images:', error)
    // Fallback to local images if API fails
    return []
  }
}

// Get reminders from API
export const getReminders = async () => {
  try {
    const response = await fetch(`${API_URL}/reminders`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return []
  }
}

// Create reminder via API
export const createReminder = async (reminderData) => {
  try {
    const response = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating reminder:', error)
    throw error
  }
}

// Get blogs from API
export const getBlogs = async () => {
  try {
    const response = await fetch(`${API_URL}/blogs`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

// Create blog via API (for lover to write back)
export const createBlog = async (blogData) => {
  try {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating blog:', error)
    throw error
  }
}

// Get Love Jar notes from API
export const getLoveJarNotes = async () => {
  try {
    const response = await fetch(`${API_URL}/lovejar`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching love jar notes:', error)
    return []
  }
}

// Create Love Jar note via API
export const createLoveJarNote = async (noteData) => {
  try {
    const response = await fetch(`${API_URL}/lovejar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating love jar note:', error)
    throw error
  }
}

// Game API functions
export const getActiveGame = async () => {
  try {
    const response = await fetch(`${API_URL}/games`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

export const getGame = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching game:', error)
    throw error
  }
}

export const createGame = async () => {
  try {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating game:', error)
    throw error
  }
}

export const joinGame = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json()
  } catch (error) {
    console.error('Error joining game:', error)
    throw error
  }
}

export const makeMove = async (gameId, position, symbol) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position, symbol }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error making move:', error)
    throw error
  }
}

// Connect Four API functions
export const getActiveConnectFour = async () => {
  try {
    const response = await fetch(`${API_URL}/connectfour`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching connect four games:', error)
    return []
  }
}

export const getConnectFour = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/connectfour/${gameId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching connect four game:', error)
    throw error
  }
}

export const createConnectFour = async () => {
  try {
    const response = await fetch(`${API_URL}/connectfour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating connect four game:', error)
    throw error
  }
}

export const joinConnectFour = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/connectfour/${gameId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json()
  } catch (error) {
    console.error('Error joining connect four game:', error)
    throw error
  }
}

export const makeConnectFourMove = async (gameId, column, color) => {
  try {
    const response = await fetch(`${API_URL}/connectfour/${gameId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ column, color }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error making connect four move:', error)
    throw error
  }
}
