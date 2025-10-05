#!/bin/bash

# Platform Icon Downloader
# This script helps download platform icons from Simple Icons

PLATFORMS_DIR="apps/web/public/platforms"

echo "🎨 Platform Icon Setup Helper"
echo "=============================="
echo ""

# Create directory if it doesn't exist
mkdir -p "$PLATFORMS_DIR"

echo "📁 Directory: $PLATFORMS_DIR"
echo ""
echo "How to add platform icons:"
echo ""
echo "Option 1: Simple Icons (Recommended)"
echo "  1. Visit https://simpleicons.org/"
echo "  2. Search for the platform (e.g., 'Reddit')"
echo "  3. Click 'Copy SVG'"
echo "  4. Save to: $PLATFORMS_DIR/{platform-slug}.svg"
echo ""
echo "Option 2: Download via CDN"
echo "  Simple Icons CDN: https://cdn.simpleicons.org/{brand-slug}/{color}.svg"
echo "  Example: https://cdn.simpleicons.org/reddit/FF4500"
echo ""

# Function to download an icon from Simple Icons CDN
download_icon() {
  local slug=$1
  local color=$2
  local output_file="$PLATFORMS_DIR/$slug.svg"
  
  echo "⬇️  Downloading $slug icon..."
  curl -s "https://cdn.simpleicons.org/$slug/$color" -o "$output_file"
  
  if [ -f "$output_file" ]; then
    echo "✅ Saved: $output_file"
  else
    echo "❌ Failed to download $slug"
  fi
}

# Prompt user
echo ""
read -p "Would you like to download common platform icons now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "Downloading common platform icons..."
  echo ""
  
  # Download common platforms
  download_icon "reddit" "FF4500"
  download_icon "facebook" "1877F2"
  download_icon "discord" "5865F2"
  download_icon "youtube" "FF0000"
  download_icon "instagram" "E4405F"
  download_icon "twitter" "1DA1F2"
  download_icon "tiktok" "000000"
  download_icon "snapchat" "FFFC00"
  download_icon "twitch" "9146FF"
  
  echo ""
  echo "✨ Done! Icons saved to $PLATFORMS_DIR/"
  echo ""
  echo "Next steps:"
  echo "1. Review the downloaded icons"
  echo "2. Update your database platforms with icon_url: '/platforms/{slug}.svg'"
  echo "3. Restart your dev server if needed"
else
  echo ""
  echo "Manual setup instructions:"
  echo "1. Create SVG files in: $PLATFORMS_DIR/"
  echo "2. Name them: {platform-slug}.svg (e.g., reddit.svg)"
  echo "3. Set icon_url in database: '/platforms/{slug}.svg'"
fi

echo ""
