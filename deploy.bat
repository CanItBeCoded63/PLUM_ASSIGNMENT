@echo off
echo ========================================
echo   OPD Claim System - Auto Deployment
echo ========================================
echo.
echo Pushing latest changes to GitHub...
git add .
git commit -m "Add deployment configuration"
git push origin main

echo.
echo ========================================
echo   Opening Render Dashboard...
echo ========================================
echo.
echo Please follow these steps:
echo 1. Sign in with GitHub
echo 2. Click "New +" and select "Web Service"
echo 3. Select: CanItBeCoded63/PLUM_ASSIGNMENT
echo 4. The configuration will be auto-detected from render.yaml
echo 5. Just add your OPENAI_API_KEY and click Deploy!
echo.
pause

start https://dashboard.render.com/select-repo?type=web

echo.
echo ========================================
echo   Alternative: Railway Deployment
echo ========================================
echo.
echo If you prefer Railway, press any key to open Railway...
pause

start https://railway.app/new

echo.
echo Deployment links opened in your browser!
echo Follow the on-screen instructions.
echo.
pause
