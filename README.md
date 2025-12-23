# 7Veda Management System 🚀

A comprehensive, futuristic, and robust **Full-Stack School Management System**. This project integrates a modern **React** frontend with a powerful **Spring Boot** backend and a **MySQL** database to provide a seamless administrative experience.

---

## 🏗️ Project Architecture

The system follows a classic client-server architecture:
- **Frontend:** React.js (Vite) - Cyberpunk/Futuristic UI with Glassmorphism.
- **Backend:** Spring Boot (Java) - RESTful API with JPA/Hibernate.
- **Database:** MySQL - Persistent storage for students, attendance, marks, and outpasses.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19
- **Build Tool:** Vite
- **State Management:** React Context API
- **Styling:** Vanilla CSS (Modern CSS Variables & Animations)
- **Utilities:** Lucide React (Icons), XLSX (Excel), jsPDF

### **Backend**
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Security:** Spring Security (Basic Auth / Logic-based RBAC)
- **Persistence:** Spring Data JPA
- **Database:** MySQL 8.0
- **Build Tool:** Maven

---

## 🌟 Key Features

### 🔐 Multi-Role Access Control
- **Admin:** Complete control over Student CRUD, Exam Schedules, and Outpass approvals.
- **Faculty:** Access to view student lists, mark attendance, and enter academic marks.
- **Automated Login:** Intelligent session handling and redirection based on roles.

### 🎓 Student & Academic Management
- **Persistent Student Records:** All data is stored in MySQL, eliminating data loss on refresh.
- **Bulk Data Import:** Support for importing student lists and marks via Excel files.
- **Attendance Persistence:** Robust attendance tracking with upsert (insert/update) logic.
- **Mark Management:** Academic performance tracking with automatic Grade/Status calculation.

### 🚪 Automated Outpass System
- **Real-Time Notifications:** Admin Navbar features a live notification bell with hover dropdown.
- **One-Click Approval:** Approve or Reject outpasses directly from the notification center.
- **Persistence Logic:** Outpasses are linked to persistent Student entities in the database.

### 🎨 Premium Sci-Fi UI
- **Dual Themes:** Toggle between "Sci-Fi Lab" (Light) and "Cyberpunk Night" (Dark).
- **Glassmorphism:** Elegant frosted-glass effects on cards and modals.
- **Responsive Layout:** optimized for 1440p monitors down to small mobile screens.

---

## 📂 Project Structure

```text
7veda-management/
├── backend/                # Java Spring Boot Application
│   ├── src/main/java/...   # Controllers, Services, Entities, Repositories
│   ├── src/main/resources/ # application.properties, students.json (seed)
│   └── pom.xml             # Maven dependencies
├── src/                    # React Frontend Application
│   ├── components/         # Premium UI Components (Navbar, GlassCards)
│   ├── context/            # Logic (Auth, Student, Theme Context)
│   ├── pages/              # Functional Pages (Dashboard, Attendance, etc.)
│   └── styles/             # Global CSS & Theme variables
├── package.json            # Frontend dependencies
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Java 17** or higher
- **Node.js** (v18+)
- **MySQL Server**

### **1. Database Setup**
- Create a database named `veda-management` in your MySQL server.
- Update `backend/src/main/resources/application.properties` with your MySQL username and password.

### **2. Backend Setup**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*The API will be available at `http://localhost:8080`*

### **3. Frontend Setup**
```bash
# From the root directory
npm install
npm run dev
```
*The app will be available at `http://localhost:5173` (or 5174)*

---

## 🔑 Default Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin` |
| **Faculty** | `fac1` | `123` |

---

## 🛠️ Maintenance & Development
- **Backend Port:** 8080
- **CORS Config:** Enabled for `localhost:5173` and `localhost:5174`.
- **Auto-Seeding:** The `DataLoader.java` automatically seeds the database with initial student data from `students.json` on the first run.

---
*Developed with Passion by Manjunath*
