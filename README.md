# 🩺 Blood Pressure & Medicine Reminder App

A full-stack health management web application that helps users **track their blood pressure**, **manage medicine reminders**, and **receive email alerts** at specified times.

This project features a modern React frontend, an Express.js backend with SQLite for data storage, and an integrated email reminder system.

---

## 🚀 Features

### 💉 Blood Pressure Tracking
- Record systolic and diastolic readings.
- Automatically calculate BP status (High, Normal, Low).
- View all past readings in a structured dashboard.

### 💊 Medicine Reminders
- Set medicine reminders with specific date and time.
- Choose whether reminders should **repeat daily**.
- Receive **email notifications** at the scheduled time.
- Edit or delete existing reminders.
- Automatic rescheduling for daily reminders.

### 🧘 Health Dashboard
- Displays latest BP readings with color-coded health status.
- Shows motivational health quotes that auto-rotate.
- View upcoming and sent reminders in real time.

### 👤 User Management
- Secure user registration and login.
- JSON Web Token (JWT) authentication.
- Persistent user sessions stored locally.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (with Vite)
- React Router DOM
- Tailwind CSS
- Lucide React Icons

### **Backend**
- Node.js with Express.js
- SQLite3 (for simplicity & portability)
- Nodemailer (for email reminders)
- dotenv (for environment management)
- Cron Jobs (for recurring email tasks)

---


## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/minahilhasan/bp-management-system.git
cd bp-management-app
cd server
npm install
(now create an .env file in the server file and copy this in the folder:
PORT=5000
JWT_SECRET=A123B456C
JWT_EXPIRES_IN=7d
DB_FILE=./data.sqlite
EMAIL_USER=bpportalsystem@gmail.com
EMAIL_PASS=ddwi gncj iqys aogv
)
cd ..
cd client
npm install
cd ..
npm install concurrently --save-dev
npm start

