import React from 'react';
import {link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const {user, isAuthenticated, logout} = useAuth();

    const handlelogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <nav className = "navbar">
            <div className = "navbar-logo">
                <link to = "/">NeighborQuest</link>

            </div>
            <div className = "navbar-links">
                <link to = "/jobs"> Find Jobs</link>
                <link to = "/workers"> Find Workers</link>

                {isAuthenticated && user?.role === "employer" && (
                    <link to = "/post-job"> Post Job</link>
    
                )}
                {isAuthenticated ? (
                    <>
                    <link to = "/dashboard"> Dashboard</link>
                    <link to = {`/profile/${user?.id}`}> Profile</link>
                    <button onclick = {handlelogout} classname = "Navbar-logout-button"> Logout</button>
                    </>


                ) :(
                    <>
                    <link to = "/login"> Login </link>
                    <link to = "/register"> Register</link>
                    </>
                )
            }
            </div>
        </nav>
    )

}
export default Navbar;