import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/userprofile', {
          params: { user_id: localStorage.getItem("user_id") }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchUserBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/userbookings', {
          params: { user_id: localStorage.getItem("user_id") }
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchUserProfile();
    fetchUserBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    { dataField: 'train_name', text: 'Train' },
    { dataField: 'date', text: 'Date', formatter: (cell) => formatDate(cell) },
  ];

  const paginationOptions = {
    sizePerPage: 10,
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '25', value: 25 },
    ],
    paginationSize: 10,
    pageStartIndex: 1,
    hideSizePerPage: false,
    showTotal: true,
    paginationTotalRenderer: (from, to, size) => (
      <span className="pagination-total">
        Showing {from} to {to} of {size} Results
      </span>
    ),
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    firstPageText: 'First',
    prePageText: 'Prev',
    nextPageText: 'Next',
    lastPageText: 'Last',
    sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelected = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-light'}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    ),
    paginationTotalRenderer: (from, to, size) => (
      <span className="mt-1 d-flex flex-column align-items-left" style={{ fontSize: '12px' }}>
        Showing {from} to {to} of {size} Results.
      </span>
    ),
    paginationSize: 5,
    withFirstAndLast: true,
    alwaysShowAllBtns: false,
    firstPageText: '<<',
    prePageText: '<',
    nextPageText: '>',
    lastPageText: '>>',
    showTotal: true,
    pageStartIndex: 1,
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '25', value: 25 },
    ],
    paginationRenderer: (props) => {
      const { onPageChange, page, prePageText, nextPageText, sizePerPageList, currSizePerPage, onSizePerPageChange } = props;
      return (
        <div>
          <nav aria-label="Page navigation example" className="d-flex justify-content-center">
            <ul className="pagination pagination-sm">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  aria-label="Previous"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page !== 1) onPageChange(page - 1);
                  }}
                >
                  <span aria-hidden="true">{prePageText}</span>
                </a>
              </li>
              <li className={`page-item ${page === props.totalPages ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  href="#"
                  aria-label="Next"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page !== props.totalPages) onPageChange(page + 1);
                  }}
                >
                  <span aria-hidden="true">{nextPageText}</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="d-flex justify-content-center mt-2">
            <div className="btn-group" role="group">
              {sizePerPageList.map((option) => {
                const isSelected = currSizePerPage === `${option.page}`;
                return (
                  <button
                    key={option.text}
                    type="button"
                    onClick={() => onSizePerPageChange(option.page)}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-light'}`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    },
  };

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
          <h3 className="card-title mt-4">Booking History</h3>
          <div style={{ fontSize: '12px' }}>
            <BootstrapTable
              keyField='id'
              data={bookings}
              columns={columns}
              pagination={paginationFactory(paginationOptions)}
              bordered
              hover
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserProfile;
