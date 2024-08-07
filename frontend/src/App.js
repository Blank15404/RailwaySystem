import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserProfileSidebar from './components/UserProfileSidebar';
import AdminProfileSidebar from './components/AdminProfileSidebar';
import AdminNavbar from './components/AdminNavbar';
import UserNavbar from './components/UserNavbar';
import Auth from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import RedirectRoute from './components/RedirectRoute';
import PageWrapper from './components/PageWrapper';
import BookingDetails from './components/BookingDetails';


function App() {
  const [showProfile, setShowProfile] = useState(false);
  const toggleProfile = () => setShowProfile(!showProfile);

    return (
      
      <Router>
      <PageWrapper>
      <Routes>
        <Route 
          path="/" 
          element={
            <RedirectRoute>
              <Auth />
            </RedirectRoute>
          } 
        />
        <Route 
          path="/user-dashboard" 
          element={
            <PrivateRoute role="user">
              <>
                <UserNavbar toggleProfile={toggleProfile} />
                <UserDashboard />
                {showProfile && <UserProfileSidebar toggleProfile={toggleProfile} />}
              </>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user-profile" 
          element={
            <PrivateRoute role="user">
              <UserProfileSidebar />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute role="admin">
              <>
                <AdminNavbar toggleProfile={toggleProfile} />
                <AdminDashboard />
                {showProfile && <AdminProfileSidebar toggleProfile={toggleProfile} />}
              </>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/abookings" 
          element={
            <PrivateRoute role="admin">
              <>
                <AdminNavbar toggleProfile={toggleProfile} />
                <BookingDetails />
                {showProfile && <AdminProfileSidebar toggleProfile={toggleProfile} />}
              </>
            </PrivateRoute>
          } 
        />        
      </Routes>
      </PageWrapper>
    </Router>
    );
}

export default App;
