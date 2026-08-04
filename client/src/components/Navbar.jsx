import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">NeighborQuest</Link>
            </div>

            <div className="navbar-links">
                <Link to="/jobs">Find Jobs</Link>
                <Link to="/workers">Find Workers</Link>

                {isAuthenticated && (user?.role === "employer" || user?.role === "both") && (
                    <Link to="/post-job">Post Job</Link>
                )}

                {isAuthenticated ? (
                    <>
                        {user?.role !== "admin" && (
                            <>
                                <Link to="/dashboard">Dashboard</Link>
                                <Link to={`/profile/${user?.id}`}>Profile</Link>
                            </>
                        )}
                        {user?.is_admin && <Link to="/admin">Admin</Link>}
                        <button onClick={handleLogout} className="navbar-logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;