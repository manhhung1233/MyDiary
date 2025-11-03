import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeSampleData } from './utils/storage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DiaryList from './pages/DiaryList';
import DiaryDetail from './pages/DiaryDetail';
import DiaryForm from './pages/DiaryForm';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MemoryLane from './pages/MemoryLane';
import CalendarView from './pages/CalendarView';
import Achievements from './pages/Achievements';
import ExportBackup from './pages/ExportBackup';
import PhotoGallery from './pages/PhotoGallery';
import NotFound from './pages/NotFound';
import './App.css';

// Initialize sample data
initializeSampleData();

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diary" element={<DiaryList />} />
            <Route path="/diary/:id" element={<DiaryDetail />} />
            <Route
              path="/diary/new"
              element={
                <ProtectedRoute>
                  <DiaryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diary/edit/:id"
              element={
                <ProtectedRoute>
                  <DiaryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/memory-lane"
              element={
                <ProtectedRoute>
                  <MemoryLane />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/export"
              element={
                <ProtectedRoute>
                  <ExportBackup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <PhotoGallery />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
