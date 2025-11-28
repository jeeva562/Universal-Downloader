#!/usr/bin/env bash
# Render build script for Universal Downloader

echo "📦 Installing Node.js dependencies..."
npm install

echo "🐍 Installing Python dependencies..."
# Install yt-dlp using curl (more reliable on Render)
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /opt/render/project/src/yt-dlp
chmod a+rx /opt/render/project/src/yt-dlp
ln -s /opt/render/project/src/yt-dlp /usr/local/bin/yt-dlp || true

# Test if yt-dlp is available
if command -v yt-dlp &> /dev/null; then
    echo "✅ yt-dlp installed successfully"
    yt-dlp --version
else
    echo "❌ yt-dlp installation failed"
    exit 1
fi

echo "✅ Build complete!"
