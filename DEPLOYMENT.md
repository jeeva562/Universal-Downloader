# Universal Downloader - Deployment Guide

## Quick Fix for Netlify Deployment

Your app isn't working on Netlify because **Netlify only hosts static files**, but your app needs a **backend server** to download videos.

---

## Solution: Deploy Frontend + Backend Separately

### Part 1: Deploy Backend to Render (FREE)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `jeeva562/Universal-Downloader`
   - Name: `universal-downloader-backend`

3. **Configure Service**
   ```
   Build Command: chmod +x build.sh && ./build.sh
   Start Command: npm run server:start
   Environment: Node
   ```

4. **Wait for Deployment**
   - Render will build and deploy (takes 3-5 minutes)
   - Copy the URL (e.g., `https://universal-downloader-backend.onrender.com`)

### Part 2: Configure Netlify Frontend

1. **Add Environment Variable in Netlify**
   - Go to your Netlify site dashboard
   - Click "Site settings" → "Environment variables"
   - Add new variable:
     ```
     Name: VITE_API_URL
     Value: https://universal-downloader-backend.onrender.com
     ```
     (Replace with YOUR actual Render URL)

2. **Redeploy Netlify Site**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Part 3: Test

1. **Wait for both deploys to complete**
2. **Open your Netlify site**
3. **Paste a YouTube URL** (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
4. **Click Download** - it should work now! ✅

---

## Alternative: Deploy Everything to Railway (Easier)

If you want a simpler solution:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway will auto-detect and deploy both frontend + backend
6. Get your deployment URL

**Note**: Railway gives you $5 free credit/month (usually enough for testing).

---

## Troubleshooting

### Backend shows "Application failed to respond"
- Check Render logs for errors
- Make sure `yt-dlp` is installed (check build logs)

### Frontend shows CORS errors
- Make sure you added the Netlify URL to CORS whitelist in `server/index.js`
- Redeploy backend after changes

### Downloads fail with 404
- Check if `VITE_API_URL` environment variable is set correctly in Netlify
- Must include `https://` and no trailing slash

---

## Files Already Created for You

✅ `render.yaml` - Render deployment config
✅ `build.sh` - Installs yt-dlp and dependencies  
✅ `src/config.ts` - Handles API URLs for dev/production
✅ Updated `DownloadForm.tsx` - Uses config for API calls
✅ Updated `server/index.js` - CORS configured for production

---

## Local Development (Unchanged)

To run locally (still works the same):

```bash
npm run start:all
```

This runs both frontend (port 8080) and backend (port 3001) together.
