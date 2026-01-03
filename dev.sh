#!/bin/bash

# TPA Interactive Shells - Development Helper Script

echo "🚀 TPA Interactive Shells - Quick Start"
echo "========================================"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check for npm
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Main menu
echo "What would you like to do?"
echo ""
echo "1) Start development server"
echo "2) Build for production"
echo "3) Start production server (build first)"
echo "4) Run linter"
echo "5) Clean build files"
echo "6) Install dependencies"
echo "7) Exit"
echo ""
read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "🔥 Starting development server..."
        echo "⚠️  If you see file watcher errors, the app will still work"
        echo "📱 Access at: http://localhost:3000"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🏗️  Building for production..."
        npm run build
        echo ""
        echo "✅ Build complete! Use option 3 to start the production server."
        ;;
    3)
        echo ""
        if [ ! -d ".next" ]; then
            echo "📦 No build found. Building first..."
            npm run build
            echo ""
        fi
        echo "🚀 Starting production server..."
        echo "📱 Access at: http://localhost:3000"
        echo ""
        npm start
        ;;
    4)
        echo ""
        echo "🔍 Running linter..."
        npm run lint
        ;;
    5)
        echo ""
        echo "🧹 Cleaning build files..."
        rm -rf .next
        rm -rf out
        echo "✅ Clean complete!"
        ;;
    6)
        echo ""
        echo "📦 Installing dependencies..."
        npm install
        echo "✅ Dependencies installed!"
        ;;
    7)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
