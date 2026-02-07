# Assets Setup Guide

## 📁 Folder Structure

Your assets should be organized like this:

```
public/
  assets/
    images/
      1.jpg
      2.jpg
      3.jpg
      ...
      30.jpg
    videos/
      wedding-video.mp4
      romantic-moment-1.mp4
      romantic-moment-2.mp4
      background-video.mp4
    gifs/
      hearts.gif
      sparkles.gif
      love.gif
```

## 🖼️ Images (30 Required)

Place **30 romantic images** in `public/assets/images/`:

- Wedding photos
- Romantic moments together
- Beautiful scenery
- Couple photos
- Special memories

**Supported formats:** JPG, PNG, WebP

**Recommended size:** 800x600px or larger (will be automatically resized)

**Naming:** Name them `1.jpg`, `2.jpg`, `3.jpg`, ... `30.jpg`

## 🎬 Videos

Place your videos in `public/assets/videos/`:

1. **wedding-video.mp4** - Your wedding video (used as fallback background)
2. **background-video.mp4** - Main background video for login page
3. **romantic-moment-1.mp4** - Romantic moments
4. **romantic-moment-2.mp4** - More romantic moments

**Supported formats:** MP4, WebM

**Recommended:** 
- Resolution: 1920x1080 or 1280x720
- Codec: H.264
- Keep file sizes reasonable (under 50MB for background videos)

## 🎨 GIFs

Place animated GIFs in `public/assets/gifs/`:

1. **hearts.gif** - Animated hearts floating
2. **sparkles.gif** - Sparkle effects
3. **love.gif** - Love-themed animations

**Tip:** You can create GIFs from video clips or find romantic animated GIFs online.

## 🚀 Quick Start

1. Create the folders if they don't exist:
   ```bash
   mkdir -p public/assets/images
   mkdir -p public/assets/videos
   mkdir -p public/assets/gifs
   ```

2. Add your images:
   - Copy your 30 romantic images to `public/assets/images/`
   - Rename them to `1.jpg`, `2.jpg`, etc.

3. Add your videos:
   - Copy your wedding video to `public/assets/videos/wedding-video.mp4`
   - Add background video to `public/assets/videos/background-video.mp4`

4. Add GIFs (optional but recommended):
   - Add animated hearts, sparkles, etc. to `public/assets/gifs/`

5. Restart your dev server:
   ```bash
   npm run dev
   ```

## 💡 Tips

- **Image optimization:** Compress images before adding them for better performance
- **Video optimization:** Use tools like HandBrake to compress videos
- **GIF creation:** Use tools like EZGIF or convert video clips to GIF
- **Fallbacks:** The app will gracefully handle missing files, but add your assets for the best experience!

## 🎥 Video Background Tips

For the best login page experience:
- Use romantic, slow-motion videos
- Avoid fast-paced action
- Keep videos under 30 seconds (they loop)
- Use soft, romantic lighting
- Consider sunset/sunrise scenes, beach walks, etc.

Enjoy creating your romantic love project! 💕

