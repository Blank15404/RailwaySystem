import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginDetails, setLoginDetails] = useState({ userId: '', password: '' });
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        email: '',
        name: '',
        role: 'user'
    });

    const navigate = useNavigate();

    const handleLoginChange = (e) => {
        setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', loginDetails);
            const { accessToken } = res.data;
            localStorage.setItem('token', accessToken);
            const { role } = JSON.parse(atob(accessToken.split('.')[1]));
            if (role === 'admin') {
                localStorage.setItem('role', "admin");
                localStorage.setItem("user_id", loginDetails.userId);
                navigate('/admin-dashboard');
            } else {
                localStorage.setItem('role', "user");
                localStorage.setItem("user_id", loginDetails.userId);
                navigate('/user-dashboard');
            }
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', formData);
            alert('Registration successful');
            setIsLogin(true);
        } catch (error) {
            console.error('Registration failed', error);
            alert(error.response?.data || 'Registration failed');
        }
    };

    return (
        <div className="mr-5 container-fluid min-vh-100 d-flex align-items-center justify-content-center">
            <div className="justify-content-center w-100">
                <div className="col-md-4">
                    <div className="card bg-primary-subtle text-info-emphasis bg-opacity shadow-sm rounded-3 m-5 mx-4">
                        <div className="card-body pt-2 p-4 mt-2">
                            <h2 className="card-title text-center text-info-emphasis mb-1">{isLogin ? 'Login' : 'Register'}</h2>
                            {isLogin ? (
                                <form onSubmit={handleLoginSubmit} className="bg-white p-4 rounded shadow-sm">
                                    <div className="form-group mb-3">
                                        <label htmlFor="userId" className="form-label fw-bold">User ID</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="userId"
                                            name="userId"
                                            placeholder="Enter User ID"
                                            value={loginDetails.userId}
                                            onChange={handleLoginChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password" className="form-label fw-bold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={loginDetails.password}
                                            onChange={handleLoginChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-warning btn-lg w-100 mt-3">Login</button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegisterSubmit} className="bg-white p-4 rounded shadow-sm">
                                    <div className="form-group mb-3">
                                        <label htmlFor="userId" className="form-label fw-bold">User ID</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="userId"
                                            name="userId"
                                            placeholder="Enter User ID"
                                            value={formData.userId}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password" className="form-label fw-bold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Enter Password again"
                                            value={formData.confirmPassword}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="phoneNumber" className="form-label fw-bold">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder="Enter Phone number"
                                            value={formData.phoneNumber}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className="form-label fw-bold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="email"
                                            name="email"
                                            placeholder="Enter Email ID"
                                            value={formData.email}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="name" className="form-label fw-bold">Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="name"
                                            name="name"
                                            placeholder="Enter User Name"
                                            value={formData.name}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="role" className="form-label fw-bold">Role</label>
                                        <select
                                            className="form-control form-control-lg"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleRegisterChange}
                                            required
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-warning btn-lg w-100 mt-3">Register</button>
                                </form>
                            )}
                            <button
                                className="btn btn-link btn-block mt-3 text-info-emphasis"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
