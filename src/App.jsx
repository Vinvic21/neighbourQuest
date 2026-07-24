import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';

import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WorkerListPage from './pages/WorkerListPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route path="/jobs" element={<JobListPage />} />
                        <Route path="/jobs/:id" element={<JobDetailPage />} />
                        <Route path="/post-job" element={<PostJobPage />} />

                        <Route path="/workers" element={<WorkerListPage />} />
                        <Route path="/profile/:id" element={<ProfilePage />} />

                        <Route path="/dashboard" element={<DashboardPage />} />

                        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>    )
}
