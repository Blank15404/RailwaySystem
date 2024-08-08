import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/Railbus-Logo.png';

const AdminNavbar = ({ nav }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-2 shadow-sm w-100">
            <div className="container-fluid">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="navbar-brand mr-5" onClick={() => nav("dash")}>
                            <img src={logo} alt="Logo" className="rounded-circle ms-2 p-2" width="120" height="120" />
                        </Link>
                    </li>
                </ul>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbarNav" aria-controls="adminNavbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="adminNavbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => nav("dash")}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => nav("booking")}>Bookings</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => nav("profile")}>Profile</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
