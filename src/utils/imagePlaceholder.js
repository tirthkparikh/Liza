// Generate placeholder images if actual images don't exist
export const generatePlaceholderImage = (index) => {
  // You can replace this with actual placeholder service or local placeholders
  const colors = [
    'ff6b9d', 'ff1744', '667eea', '764ba2', 'f093fb',
    'ff9a9e', 'fecfef', 'a8edea', 'fed6e3', 'ffecd2',
    'fcb69f', 'ff8a80', 'ea4c89', 'ffd89b', '19547b',
    'ff9a56', 'ff6a88', 'ee0979', 'ff6a00', 'ee0979',
    'c471ed', 'f64f59', 'ffc837', 'ff8008', 'ff0080',
    '00c9ff', '92fe9d', 'ff6e7f', 'bfe9ff', 'ffecd2'
  ]
  
  const color = colors[index % colors.length]
  return `https://via.placeholder.com/800x600/${color}/ffffff?text=Romantic+Image+${index + 1}`
}

// Check if image exists, return placeholder if not
export const getImageWithFallback = (imagePath, index) => {
  // In production, you'd check if file exists
  // For now, return the path (browser will show broken image if missing)
  // You can add actual file checking logic here
  return imagePath || generatePlaceholderImage(index)
}

