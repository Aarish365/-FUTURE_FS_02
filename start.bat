@echo off
echo 🎯 LeadFlow CRM - Startup Helper
echo ==================================
echo.

echo Checking MongoDB...
mongosh --eval "db.version()" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ MongoDB is running
) else (
    echo ⚠️ MongoDB is NOT running!
    echo.
    echo Start MongoDB with one of these commands:
    echo   • Open MongoDB Compass and start the local instance
    echo   • Run: mongod (from MongoDB installation)
    echo   • Use Docker: docker run -d -p 27017:27017 mongo
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "!continue!"=="y" (
        echo Aborted.
        exit /b 1
    )
)

echo.
echo Starting LeadFlow CRM...
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo.
echo Login credentials:
echo   Username: admin
echo   Password: admin123
echo.

npm run dev
