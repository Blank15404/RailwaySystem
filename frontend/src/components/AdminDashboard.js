import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Container } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentTrain, setCurrentTrain] = useState({
    Train_ID: '',
    Train_Name: '',
    Source: '',
    Destination: '',
    Departure_time: '',
    Arrival_time: '',
    Seat_capacity: '',
    Seat_available: '',
  });

  const fetchTrains = async () => {
    try {
      const response = await axios.get('http://localhost:5000/atrains');
      setTrains(response.data);
    } catch (error) {
      console.error('Error fetching train details:', error);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTrain({ ...currentTrain, [name]: value });
  };

  const handleSave = async () => {
    if (currentTrain.Train_ID) {
      // Update train details
      try {
        await axios.put(`http://localhost:5000/crudtrains/${currentTrain.Train_ID}`, currentTrain);
        fetchTrains();
        setShowModal(false);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error updating train details:', error);
      }
    } else {
      // Create new train
      try {
        await axios.post('http://localhost:5000/crudtrains', currentTrain);
        fetchTrains();
        setShowModal(false);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error creating new train:', error);
      }
    }
  };

  const handleEdit = (train) => {
    setCurrentTrain(train);
    setShowModal(true);
  };

  const handleDelete = async (Train_ID) => {
    try {
      await axios.delete(`http://localhost:5000/crudtrains/${Train_ID}`);
      fetchTrains();
    } catch (error) {
      console.error('Error deleting train:', error);
    }
  };

  const handleAddNew = () => {
    setCurrentTrain({
      Train_ID: '',
      Train_Name: '',
      Source: '',
      Destination: '',
      Departure_time: '',
      Arrival_time: '',
      Seat_capacity: '',
      Seat_available: '',
    });
    setShowModal(true);
  };

  const columns = [
    { dataField: 'Train_ID', text: 'Train ID', sort: true },
    { dataField: 'Train_Name', text: 'Train Name', sort: true },
    { dataField: 'Source', text: 'Source', sort: true },
    { dataField: 'Destination', text: 'Destination', sort: true },
    { dataField: 'Departure_time', text: 'Departure Time', sort: true },
    { dataField: 'Arrival_time', text: 'Arrival Time', sort: true },
    { dataField: 'Seat_capacity', text: 'Seat Capacity', sort: true },
    { dataField: 'Seat_available', text: 'Seat Available', sort: true },
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: (cellContent, row) => (
        <div className="d-grid gap-2 mx-auto">
          <Button variant="warning" onClick={() => handleEdit(row)} className="mr-2">
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.Train_ID)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const paginationOptions = {
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '25', value: 25 },
      { text: '50', value: 50 },
      { text: '75', value: 75 },
      { text: '100', value: 100 },
    ],
  };

  return (
    <Container className="mt-5">
      <Card className="mb-4 mt-4">
        <h1 className="text-center m-3">Admin Dashboard</h1>
        <Card.Header>
          <h2>Train Details</h2>
          <Button variant="primary" className="float-right" onClick={handleAddNew}>
            Add New Train
          </Button>
        </Card.Header>
        <Card.Body>
          <BootstrapTable
            keyField="Train_ID"
            data={trains}
            columns={columns}
            pagination={paginationFactory(paginationOptions)}
            bordered
            hover
            bootstrap4
          />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTrain.Train_ID ? 'Edit Train Details' : 'Add New Train'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTrainName">
              <Form.Label>Train Name</Form.Label>
              <Form.Control
                type="text"
                name="Train_Name"
                value={currentTrain.Train_Name}
                onChange={handleInputChange}
                placeholder="Enter train name"
              />
            </Form.Group>
            <Form.Group controlId="formSource">
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                name="Source"
                value={currentTrain.Source}
                onChange={handleInputChange}
                placeholder="Enter source"
              />
            </Form.Group>
            <Form.Group controlId="formDestination">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="Destination"
                value={currentTrain.Destination}
                onChange={handleInputChange}
                placeholder="Enter destination"
              />
            </Form.Group>
            <Form.Group controlId="formDepartureTime">
              <Form.Label>Departure Time</Form.Label>
              <Form.Control
                type="time"
                name="Departure_time"
                value={currentTrain.Departure_time}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formArrivalTime">
              <Form.Label>Arrival Time</Form.Label>
              <Form.Control
                type="time"
                name="Arrival_time"
                value={currentTrain.Arrival_time}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSeatCapacity">
              <Form.Label>Seat Capacity</Form.Label>
              <Form.Control
                type="number"
                name="Seat_capacity"
                value={currentTrain.Seat_capacity}
                onChange={handleInputChange}
                placeholder="Enter seat capacity"
              />
            </Form.Group>
            <Form.Group controlId="formSeatAvailable">
              <Form.Label>Seat Available</Form.Label>
              <Form.Control
                type="number"
                name="Seat_available"
                value={currentTrain.Seat_available}
                onChange={handleInputChange}
                placeholder="Enter available seats"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Changes done successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
