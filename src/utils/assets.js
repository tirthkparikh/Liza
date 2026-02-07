// Asset paths - replace with your actual images and videos
// Place your romantic images in: public/assets/images/1.jpg through 30.jpg
export const images = {
  // Romantic images (1-30) - Add your wedding photos and romantic moments here!
  romantic1: '/assets/images/1.jpg',
  romantic2: '/assets/images/2.jpg',
  romantic3: '/assets/images/3.jpg',
  romantic4: '/assets/images/4.jpg',
  romantic5: '/assets/images/5.jpg',
  romantic6: '/assets/images/6.jpg',
  romantic7: '/assets/images/7.jpg',
  romantic8: '/assets/images/8.jpg',
  romantic9: '/assets/images/9.jpg',
  romantic10: '/assets/images/10.jpg',
  romantic11: '/assets/images/11.jpg',
  romantic12: '/assets/images/12.jpg',
  romantic13: '/assets/images/13.jpg',
  romantic14: '/assets/images/14.jpg',
  romantic15: '/assets/images/15.jpg',
  romantic16: '/assets/images/16.jpg',
  romantic17: '/assets/images/17.jpg',
  romantic18: '/assets/images/18.jpg',
  romantic19: '/assets/images/19.jpg',
  romantic20: '/assets/images/20.jpg',
  romantic21: '/assets/images/21.jpg',
  romantic22: '/assets/images/22.jpg',
  romantic23: '/assets/images/23.jpg',
  romantic24: '/assets/images/24.jpg',
  romantic25: '/assets/images/25.jpg',
  romantic26: '/assets/images/26.jpg',
  romantic27: '/assets/images/27.jpg',
  romantic28: '/assets/images/28.jpg',
  romantic29: '/assets/images/29.jpg',
  romantic30: '/assets/images/30.jpg',
}

// Video paths - Add your wedding video and romantic moments here!
export const videos = {
  wedding: '/assets/videos/wedding-video.mp4', // Your wedding video
  romantic1: '/assets/videos/romantic-moment-1.mp4', // Romantic moments
  romantic2: '/assets/videos/romantic-moment-2.mp4',
  background: '/assets/videos/background-video.mp4', // Background video for login page
}

// GIF paths - Add animated GIFs for extra effects!
export const gifs = {
  hearts: '/assets/gifs/hearts.gif', // Animated hearts
  sparkles: '/assets/gifs/sparkles.gif', // Sparkle effects
  love: '/assets/gifs/love.gif', // Love animations
}

// Fallback to placeholder images if actual images don't exist
export const getImageUrl = (imageKey, fallback = true) => {
  const url = images[imageKey]
  if (!fallback) return url
  
  // Return placeholder if image doesn't exist (you can replace with actual check)
  return url || `https://picsum.photos/800/600?random=${Math.random()}`
}

// Get random romantic image
export const getRandomRomanticImage = () => {
  const keys = Object.keys(images).filter(k => k.startsWith('romantic'))
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return images[randomKey]
}

