import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestItem from './RequestItem';

const RequestList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div style={styles.container}>
      {requests.length > 0 ? (
        requests.map((request) => (
          <RequestItem key={request._id} request={request} />
        ))
      ) : (
        <p>No requests found</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
};

export default RequestList;
