// Helper script for Railway deployment
// Railway will auto-detect and use package.json scripts

console.log('🚀 Starting Liza Love Server...')
console.log('📦 Environment:', process.env.NODE_ENV || 'development')
console.log('🗄️  MongoDB:', process.env.MONGODB_URI ? 'Configured' : 'Not configured')

