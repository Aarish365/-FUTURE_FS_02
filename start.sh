#!/bin/bash

echo "🎯 LeadFlow CRM - Startup Helper"
echo "=================================="
echo ""

# Check MongoDB
echo "Checking MongoDB..."
if mongosh --eval "db.version()" 2>/dev/null || mongo --eval "db.version()" 2>/dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is NOT running!"
    echo ""
    echo "Start MongoDB with one of these commands:"
    echo "  • brew services start mongodb-community  (macOS)"
    echo "  • sudo systemctl start mongod           (Linux)"
    echo "  • docker run -d -p 27017:27017 mongo   (Docker)"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo ""
echo "Starting LeadFlow CRM..."
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Login credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""

npm run dev
