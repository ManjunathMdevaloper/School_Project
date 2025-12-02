# 7Veda Management System (Sri Sudha School)

A comprehensive, futuristic, and responsive school management web application built with **React** and **Vite**. This system is designed to streamline administrative tasks, student data management, and communication within the school.

## 🚀 Features

### 🔐 Role-Based Access Control (RBAC)
*   **Admin Portal:** Full access to all features including student management, schedule creation, and outpass approvals.
*   **Faculty Portal:** Restricted access focused on viewing data, attendance, and marks entry.
*   **Secure Login:** Distinct login credentials for different roles.

### 🎓 Student Management
*   **Centralized Database:** View and manage detailed student records.
*   **Bulk Operations:** Import student data via Excel (`.xlsx`) files.
*   **CRUD Actions:** Add, Edit, and Delete student profiles (Admin only).
*   **Search & Filter:** Easily find students by name or class.

### 📝 Academic Management
*   **Marks Entry:** Record marks for various subjects and months.
*   **Auto-Grading:** Automatically calculates "Pass" or "Fail" status based on marks.
*   **Exam Schedules:** Create and manage exam timetables with "Total Marks" indicators.
*   **Attendance Tracking:** Mark and monitor daily student attendance.

### 🚪 Outpass System
*   **Digital Requests:** Create outpass requests with reasons and timing.
*   **Admin Notification Center:** Real-time bell icon notifications for pending requests.
*   **Quick Actions:** Admins can "Accept" or "Reject" requests directly from the navbar dropdown.
*   **Status Tracking:** Visual indicators (Green/Red/Yellow) for Approved/Rejected/Pending statuses.

### 🎨 UI/UX & Design
*   **Futuristic Aesthetic:** Glassmorphism effects, neon glows, and smooth transitions.
*   **Responsive Design:** Fully optimized for Desktop, Tablet, and Mobile devices.
*   **Theme Support:** Toggle between Light (Sci-Fi Lab) and Dark (Cyberpunk) modes.
*   **Interactive Elements:** Hover effects, animated modals, and dynamic badges.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 19
*   **Build Tool:** Vite
*   **Routing:** React Router DOM
*   **Styling:** Vanilla CSS (CSS Variables, Flexbox, Grid)
*   **Data Handling:** XLSX (Excel export/import), jsPDF (PDF generation)
*   **State Management:** React Context API (`AuthContext`, `StudentContext`, `ThemeContext`)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ManjunathMdevaloper/School_Project.git
    cd School_Project
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🔑 Default Credentials

Use the following credentials to test the role-based features:

| Role    | Username | Password | Access Level |
| :------ | :------- | :------- | :----------- |
| **Admin**   | `admin`  | `admin`  | Full Control (Manage Students, Schedules, Outpasses) |
| **Faculty** | `fac1`   | `123`    | Limited Access (View Data, Marks, Attendance) |

## 📱 Mobile Experience

The application is fully responsive. On mobile devices:
*   **Navigation:** Accessible via a hamburger menu.
*   **Notifications:** Admin notifications are available in the mobile drawer.
*   **Layout:** Cards and grids stack vertically for better readability.

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components (Navbar, etc.)
├── context/      # Global state management (Auth, Student, Theme)
├── data/         # Initial mock data
├── pages/        # Main application pages (Home, StudentList, etc.)
├── styles/       # CSS files (global.css, etc.)
└── App.jsx       # Main application entry point
```

---
*Developed by Manjunath*
