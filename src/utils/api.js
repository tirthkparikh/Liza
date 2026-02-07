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
