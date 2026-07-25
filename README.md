# 🎓 EduVoice

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **EduVoice** is a modern, collaborative educational ecosystem designed to empower students, teachers, and institution administrators. Built for the **GMC Internal Hackathon 2026** under the theme *"Empowering Education Through Technology"*, EduVoice removes psychological barriers in the classroom through tracked anonymous interactions and transparent grievance management.

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 🌟 Overview

EduVoice bridges the gap between formal classroom management and informal student engagement. Our platform tackles the core issue of student hesitation in Nepali classrooms by providing a safe, anonymous, yet accountable way to ask questions and report grievances.

Built with a powerful **Laravel 12** backend and a highly dynamic, reactive **React 18** frontend (powered by **Inertia.js**), the application offers a premium, modern single-page application (SPA) experience.

---

## 🚀 Key Features

### 🏢 Institutional Management
- **Multi-Tenant Architecture:** Secure separation of data (semesters, subjects, students) across different institutions.
- **Advanced Role-Based Access Control (RBAC):** Powered by Spatie. Custom dashboards and scoped data views for Super Admins, Institution Admins, Teachers, and Students.

### 🗣️ Trackable Anonymous Q&A (Hero Feature)
- **Barrier-Free Learning:** Students can ask questions anonymously to avoid peer judgment.
- **Tracking Tokens:** When a student posts anonymously, they receive a unique tracking token (e.g., `QA-X8H2B1`) which allows them to track answers and replies without exposing their identity.
- **Persistent Pseudonyms:** Anonymous users are assigned fun, persistent pseudonyms (e.g., *CuriousPanda42*) to build a safe reputation over time.

### 🚨 Grievance Management System
- **Transparent Reporting:** Students can report institutional or academic grievances.
- **Integrated Modals:** Seamless "Submit Grievance" and "Track Grievance" modals directly on the feed—no jarring page reloads.
- **Evidence Uploads:** Support for photo and video attachments when reporting issues.

### 📚 Academic & Classroom Tools
- **Assignment Lifecycle Management:** Workflow for creating assignments, handling submissions, and facilitating teacher grading.
- **Teacher Engagement Insights:** Chart.js-powered dashboards showing teachers the impact of anonymous engagement vs. public engagement.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Backend** | Laravel 12.x (PHP 8.2+) |
| **Frontend** | React 18, Inertia.js |
| **Styling** | TailwindCSS, Chart.js |
| **Database** | MySQL |
| **Authorization** | Spatie Laravel Permission |

---

## ⚙️ Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Sangamrai021/gmc_backbenchers.git
   cd gmc_backbenchers
   ```

2. **Install Dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run Migrations & Seeders:**
   ```bash
   php artisan migrate:fresh --seed
   ```
   > *Note: Seeders will populate your database with essential roles, demo users, and realistic test data.*

5. **Start the Development Servers:**
   Terminal 1: `php artisan serve`
   Terminal 2: `npm run dev`

6. **Access:** Navigate to `http://localhost:8000`

---

## 📄 License
EduVoice is open-sourced software licensed under the MIT license.
