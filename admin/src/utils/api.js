// API configuration for admin panel
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export const API_URL = `${API_BASE_URL}/api`

// Game API functions
export const getActiveGame = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/games`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
  }
}

export const getGame = async (gameId) => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/games/${gameId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching game:', error)
    throw error
  }
}

export const createGame = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/games/${gameId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/games/${gameId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ position, symbol }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error making move:', error)
    throw error
  }
}

// Blog/Letters API functions
export const getBlogs = async () => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/blogs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating blog:', error)
    throw error
  }
}
