import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/abookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const columns = [
    { dataField: 'Booking_ID', text: 'Booking ID', sort: true },
    { dataField: 'User_ID', text: 'User ID', sort: true },
    { dataField: 'Train_Name', text: 'Train Name', sort: true },
    {
      dataField: 'Date',
      text: 'Date',
      formatter: (cell) => formatDate(cell),
      sort: true,
    },
  ];

  const paginationOptions = {
    sizePerPage: 10,
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
        <h1 className="text-center m-3">Booking Details</h1>
        <Card.Body>
          <BootstrapTable
            keyField="Booking_ID"
            data={bookings}
            columns={columns}
            pagination={paginationFactory(paginationOptions)}
            bordered
            hover
            bootstrap4
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetails;
