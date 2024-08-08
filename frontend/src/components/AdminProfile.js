import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

const AdminProfile = () => {
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
    <div className="container mt-5">
      <Card className="profile-page shadow-lg p-3 mb-5 bg-white rounded">
        <Card.Header className="bg-primary text-white">
          <h3 className="card-title text-center">Profile Details</h3>
        </Card.Header>
        <Card.Body>
          <p className="card-text"><strong>Name:</strong> {user.user_id}</p>
          <p className="card-text"><strong>Email:</strong> {user.email}</p>
          <p className="card-text"><strong>Phone:</strong> {user.phone_number}</p>
          <p className="card-text"><strong>Role:</strong> Admin</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminProfile;
