import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, ListGroup, Container } from 'react-bootstrap';

const UserDashboard = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [bookedTrain, setBookedTrain] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sources = ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"];
  const destinations = ["Goa", "Mumbai", "Kolhapur", "Chennai", "Ahmedabad", "Bhopal", "Lucknow", "Patna", "Jaipur", "Delhi", "Agra", "Bhagalpur", "Bangalore", "Hyderabad", "Hubli", "Ernakulam", "Thiruvananthapuram", "Amritsar", "Jodhpur"];

  const fetchTrains = async () => {
    try {
      const response = await axios.get('http://localhost:5000/trains', { params: { source, destination } });
      setTrains(response.data);
    } catch (error) {
      console.error("Failed to fetch trains");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (source && destination) {
        fetchTrains();
      }
    }, 3000); // Fetch trains data every 3 seconds

    return () => clearInterval(interval);
  }, [source, destination]);

  const handleSearch = () => {
    fetchTrains();
  };

  const handleBook = async (train) => {
    try {
      await axios.post('http://localhost:5000/bookings', { user_id: localStorage.getItem("user_id"), train_id: train.Train_ID, date: new Date().toISOString().split('T')[0] });
      alert('Booking successful');
      setBookedTrain(train);
      setShowModal(true);
      setTimeout(() => {
        alert('Thank you for your booking. Enjoy your ride with us.');
        setBookedTrain(null);
        fetchTrains(); // Fetch trains data after booking
      }, 2000);
    } catch (error) {
      console.error("Booking failed");
    }
  };

  return (
    <Container className="mt-5" style={{width:7000}}>
      <Card className="mb-4 mt-4">
      <h1 className="text-center m-3">User Dashboard</h1>
        <Card.Header>
          <h2>Search Trains</h2>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Control type="text" list="sources" value={source} onChange={(e) => setSource(e.target.value)} />
              <datalist id="sources">
                {sources.map((source) => <option key={source} value={source} />)}
              </datalist>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Control type="text" list="destinations" value={destination} onChange={(e) => setDestination(e.target.value)} />
              <datalist id="destinations">
                {destinations.map((destination) => <option key={destination} value={destination} />)}
              </datalist>
            </Form.Group>
            <Button onClick={handleSearch} variant="primary">Search Trains</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h2>Available Trains</h2>
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {trains.map(train => (
              <ListGroup.Item key={train.Train_ID} className="d-flex justify-content-between align-items-center">
                {train.Train_Name} - {train.Seat_available} seats available
                <Button onClick={() => handleBook(train)} variant="success" disabled={train.Seat_available === 0}>
                  {train.Seat_available > 0 ? 'Book Now' : 'No seats available'}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Booking for {bookedTrain?.Train_Name}</h4>
          <p>Redirecting to payment...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
