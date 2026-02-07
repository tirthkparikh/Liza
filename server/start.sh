#!/bin/bash
# Railway/Render startup script

echo "🚀 Starting Liza Love Server..."

# Create uploads directory if it doesn't exist
mkdir -p uploads/images

# Start the server
node server.js

