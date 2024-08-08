// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RedirectRoute from './components/RedirectRoute';
import Auth from './components/Auth';
import UserHome from './Pages/UserHome';
import AdminHome from './Pages/AdminHome';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

function App() {
    return (
        <div className="app-background">
            <Router>
                <Routes>
                    <Route path="/" element={
                      <RedirectRoute>
                        <Auth/>
                      </RedirectRoute>
                    }/>
                    <Route path="/userhome" element={<PrivateRoute  element={UserHome} />} />
                    <Route path="/adminhome" element={<PrivateRoute element={AdminHome} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
