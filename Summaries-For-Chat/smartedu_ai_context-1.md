# SmartEdu -- AI Context File

Owner: Lokesh Project Type: Ed-Tech Platform Primary Goal: Build a
scalable learning platform with tutor & student dashboards.

  ------------------
  PROJECT OVERVIEW
  ------------------

SmartEdu is an Ed-Tech platform designed to connect students and tutors.

Core ideas: • Tutor dashboards • Student dashboards • Course creation &
management • Learning content delivery • Authentication system •
Database-driven backend • SaaS-style architecture

  ------------
  TECH STACK
  ------------

Frontend • Next.js (App Router) • React • TailwindCSS

Backend • Node.js APIs • Database integration

Database • PostgreSQL

Development Tools • VS Code • Git • GitHub

  ------------
  REPOSITORY
  ------------

GitHub Repo:
https://github.com/Lokesh-Sohanda8/Edu-Tech-Platform-SmartEdu

Local Project Folder: Smart-Edu-Knowletive-Project

  -----------------------------
  IMPORTANT PROJECT STRUCTURE
  -----------------------------

Smart-Edu-Knowletive-Project │ ├── client │ ├── app │ ├── components │
├── styles │ ├── package.json │ └── next.config.js │ ├── server │ ├──
.gitignore └── README.md

  ----------------------------
  GIT RULES FOR THIS PROJECT
  ----------------------------

Never commit:

node_modules/ .next/ .env

These are machine-generated files.

  -----------------------
  STANDARD GIT WORKFLOW
  -----------------------

1)  Make code changes

2)  Stage files

git add .

3)  Commit changes

git commit -m "Describe change"

4)  Pull latest updates

git pull origin main --rebase

5)  Push code

git push origin main

  ------------------------------
  COMMON ISSUES ALREADY SOLVED
  ------------------------------

Issue 1: node_modules pushed to Git Solution: git rm -r --cached
node_modules

Issue 2: GitHub file \>100MB Cause: Next.js SWC binary inside
node_modules

Issue 3: .next build files blocking merge Solution: delete .next folder

Issue 4: next-env.d.ts conflict Solution: delete file and continue
rebase

  ------------------------
  NEXT DEVELOPMENT GOALS
  ------------------------

High Priority:

• Tutor Dashboard UI • Student Dashboard UI • Course creation system •
Database models • API connections • Authentication system

Medium Priority:

• Payment system • Progress tracking • Admin panel

Future Vision:

• Full SaaS Ed-Tech platform • Scalable course marketplace •
Multi-instructor system

  ------------------------
  CURRENT PROJECT STATUS
  ------------------------

Repository connected to GitHub Git workflow working Next.js project
running VS Code source control working

Development can continue normally.

  ----------------------
  HOW TO USE THIS FILE
  ----------------------

When starting a new AI chat, paste this file and say:

"Use this SmartEdu AI context and continue helping me develop the
project."

This allows the AI to immediately understand:

• the project • the architecture • the tech stack • the development
stage

  -------------
  END OF FILE
  -------------
