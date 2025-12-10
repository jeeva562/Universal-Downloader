# Universal Downloader

A modern, responsive web application for downloading videos, audio, and images from various platforms.

## 🌟 Features

- **Video Downloads**: YouTube, TikTok, Instagram, Vimeo, and more
- **Audio Extraction**: Download audio-only from video platforms
- **Quality Options**: Choose from multiple quality settings (Best, 720p, 480p, 360p)
- **Direct Image Downloads**: Support for direct image URLs (.jpg, .png, .webp, .gif)
- **Modern UI**: Beautiful, responsive design with glassmorphism effects
- **Privacy-Focused**: No registration required, direct downloads

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing

### Backend
- **Express.js** - Node.js web framework
- **yt-dlp** - Universal video/audio downloader (system binary)
- **FFmpeg** - Media processing (required for quality merging)

## 📋 Requirements

### System Dependencies
- **Node.js** 18+ 
- **yt-dlp** - Install globally:
  ```bash
  # Windows (using Chocolatey)
  choco install yt-dlp
  
  # macOS (using Homebrew)
  brew install yt-dlp
  
  # Linux
  sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
  sudo chmod a+rx /usr/local/bin/yt-dlp
  ```

- **FFmpeg** - Install globally:
  ```bash
  # Windows (using Chocolatey)
  choco install ffmpeg
  
  # macOS (using Homebrew)
  brew install ffmpeg
  
  # Linux
  sudo apt install ffmpeg
  ```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify system dependencies**
   ```bash
   yt-dlp --version
   ffmpeg -version
   ```

## 🎮 Usage

### Development Mode

Start both frontend and backend servers concurrently:

```bash
npm run start:all
```

This will start:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:8080

### Run Separately

```bash
# Backend only
npm run server:dev

# Frontend only
npm run dev
```

### Production Build

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🚀 Deployment

This app requires **separate deployment** for frontend (static) and backend (server).

### Option 1: Netlify + Render (Recommended - Free)

#### Backend (Render)
1. Create account at [render.com](https://render.com)
2. New → Web Service → Connect your GitHub repo
3. Configure:
   - **Build Command**: `bash build-render.sh`
   - **Start Command**: `npm run server:start`
4. Copy your Render URL (e.g., `https://universal-downloader-backend.onrender.com`)

#### Frontend (Netlify)
1. Deploy to [Netlify](https://netlify.com) from GitHub
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL
3. Trigger redeploy

### Option 2: Railway (All-in-One)
1. Create account at [railway.app](https://railway.app)
2. Deploy from GitHub - Railway auto-detects configuration
3. Get your deployment URL

> 📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.


## 🌐 Supported Platforms

### ✅ Fully Supported

| Platform | Videos | Audio | Images | Notes |
|----------|:------:|:-----:|:------:|-------|
| YouTube | ✅ | ✅ | ❌ | All qualities supported |
| TikTok | ✅ | ✅ | ❌ | Public videos only |
| Instagram | ✅ | ✅ | ❌ | Videos/Reels only (not posts) |
| Vimeo | ✅ | ✅ | ❌ | Public videos |
| Direct URLs | ✅ | ✅ | ✅ | .mp4, .webm, .jpg, .png, etc. |

### ❌ Known Limitations

- **Instagram Images**: Platform blocks automated image extraction
  - **Workaround**: Use browser's "Save Image As..." feature
- **Private Content**: Login-required videos are not supported
- **Live Streams**: Currently not supported
- **Playlists**: Single videos only

## 📖 API Documentation

### Endpoints

#### `GET /api/health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok"
}
```

#### `GET /api/download`
Universal download endpoint for all media types.

**Query Parameters**:
- `url` (required): The URL to download from
- `format` (optional): Download format
  - `video` - Best quality with audio (default)
  - `audio` - Audio only
  - `720p`, `480p`, `360p` - Specific video quality
  - `image` - Direct image download


## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3001              # Backend server port (default: 3001)
```

### CORS Configuration

By default, CORS is enabled for all origins in development. For production, update `server/index.js`:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

## 🏗️ Project Structure

```
├── src/                      # Frontend source code
│   ├── components/          # React components
│   │   ├── Hero.tsx
│   │   ├── DownloadForm.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Route pages
│   ├── assets/             # Static assets
│   └── index.css           # Global styles
├── server/                  # Backend source code
│   ├── index.js           # Express server
│   └── utils/             # Utility functions
│       └── filename.js    # Filename sanitization
├── public/                 # Public static files
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── README.md              # This file
```

## 🐛 Troubleshooting

### "yt-dlp: command not found"
- Make sure yt-dlp is installed globally and in your PATH
- Verify with: `yt-dlp --version`

### "FFmpeg not found"
- Install FFmpeg globally
- Verify with: `ffmpeg -version`

### Downloads fail with "ERROR"
- Check if the video is public
- Try updating yt-dlp: `yt-dlp -U` (may require admin rights)
- Check server logs for detailed error messages

### Instagram images not working
- This is expected - Instagram blocks automated image downloads
- Use the browser's built-in "Save Image" feature instead

## 📚 Resources

- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 🙏 Acknowledgments

- **yt-dlp** - Universal video downloader
- **FFmpeg** - Media processing framework
- **shadcn/ui** - Beautiful UI components

---

Made with ❤️ using modern web technologies
