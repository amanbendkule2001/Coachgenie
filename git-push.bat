@echo off
echo === SmartEdu Git Push ===
echo.

cd /d "c:\Users\shoai\Downloads\Smart-Edu-Knowletive-Project"

echo [1/3] Staging all files...
git add -A

echo [2/3] Committing...
git commit -m "feat: Add SmartEdu Tutor Dashboard UI with Next.js 14 + Tailwind CSS"

echo [3/3] Pushing to origin/main...
git push origin main

echo.
echo === Done! ===
git log --oneline -3

pause
