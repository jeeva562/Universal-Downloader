#!/usr/bin/env bash
# Render build script for Universal Downloader

set -e  # Exit on any error

echo "📦 Installing Node.js dependencies..."
npm install

echo "🔧 Creating bin directory..."
mkdir -p bin

echo "📥 Downloading yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp

echo "🔐 Making yt-dlp executable..."
chmod a+rx bin/yt-dlp

echo "🧪 Testing yt-dlp installation..."
export PATH="$PWD/bin:$PATH"
if command -v yt-dlp &> /dev/null; then
    echo "✅ yt-dlp installed successfully"
    yt-dlp --version
else
    echo "❌ yt-dlp installation failed"
    echo "Trying direct path..."
    ./bin/yt-dlp --version
fi

echo "✅ Build complete!"
