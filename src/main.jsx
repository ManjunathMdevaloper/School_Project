import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StudentProvider } from './context/StudentContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StudentProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StudentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
