import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Offcanvas } from 'react-bootstrap';

const AdminProfileSidebar = ({ toggleProfile }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/adminprofile', {
          params: { user_id: localStorage.getItem("user_id") }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []); // Add an empty dependency array to ensure this effect only runs once

  return (
    <Offcanvas show={true} onHide={toggleProfile} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Profile Details</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="card profile-sidebar shadow-lg p-3 mb-5 bg-white rounded">
          <div className="card-header bg-primary text-white">
            <h3 className="card-title text-center">Profile Details</h3>
          </div>
          <div className="card-body">
            <p className="card-text"><strong>Name:</strong> {user.user_id}</p>
            <p className="card-text"><strong>Email:</strong> {user.email}</p>
            <p className="card-text"><strong>Phone:</strong> {user.phone_number}</p>
            <p className="card-text"><strong>Role:</strong> Admin</p>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AdminProfileSidebar;
