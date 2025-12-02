import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import StudentList from './pages/StudentList';
import StudentOverview from './pages/StudentOverview';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Outpass from './pages/Outpass';
import ManageData from './pages/ManageData';
import ExamSchedules from './pages/ExamSchedules';
import Login from './pages/Login';
import './styles/global.css';

const AppContent = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/overview" element={<StudentOverview />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/outpass" element={<Outpass />} />
          <Route path="/manage" element={<ManageData />} />
          {userRole === 'admin' && <Route path="/schedules" element={<ExamSchedules />} />}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />

      <style>{`
        .app-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--bg-primary);
        }
        .main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
