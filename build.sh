#!/bin/bash

# Install yt-dlp
echo "Installing Python and yt-dlp..."
apt-get update
apt-get install -y python3 python3-pip
pip3 install -U yt-dlp

# Install Node dependencies
echo "Installing Node dependencies..."
npm install

echo "Build complete!"
