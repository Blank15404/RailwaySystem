import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = ({ toggleProfile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-4 shadow-sm w-100">
            <div className="container-fluid">
            <ul className="navbar-nav me-auto">
                <li className="nav-item">
                    <img src="/path/to/logo.png" alt="Logo" className="rounded-circle ms-2 p-3" width="50" height="50" />
                </li>
                </ul>
                <Link className="navbar-brand mr-5" to="/">Railway System</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminnavbarNav" aria-controls="adminnavbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="adminnavbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="#" onClick={toggleProfile}>Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Trains</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/abookings">Bookings</Link>
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
