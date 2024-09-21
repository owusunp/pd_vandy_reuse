import React, { useState, useEffect } from 'react';
import { useUnreadCount } from '../UnreadCountContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: 'John Smith',
      message: 'Selling a desk lamp',
      date: '2024-09-15T10:30:00Z',
      isRead: false,
    },
    {
      id: 2,
      user: 'Emily White',
      message: 'Looking for a mini fridge',
      date: '2024-09-13T09:15:00Z',
      isRead: true,
    },
    {
      id: 3,
      user: 'Michael Brown',
      message: 'Selling a bicycle',
      date: '2024-09-10T14:45:00Z',
      isRead: false,
    },
    {
      id: 4,
      user: 'Sarah Johnson',
      message: 'Looking for a printer',
      date: '2024-09-12T08:20:00Z',
      isRead: true,
    },
    {
      id: 5,
      user: 'David Lee',
      message: 'Selling a coffee maker',
      date: '2024-09-17T11:00:00Z',
      isRead: false,
    },
    {
      id: 6,
      user: 'Sophia Davis',
      message: 'Looking for a study chair',
      date: '2024-09-16T16:35:00Z',
      isRead: true,
    },
    {
      id: 7,
      user: 'Chris Miller',
      message: 'Selling a gaming monitor',
      date: '2024-09-14T13:10:00Z',
      isRead: false,
    },
    {
      id: 8,
      user: 'Olivia Wilson',
      message: 'Looking for a bookshelf',
      date: '2024-09-18T07:50:00Z',
      isRead: true,
    },
    {
      id: 9,
      user: 'James Clark',
      message: 'Selling an air conditioner',
      date: '2024-09-11T12:25:00Z',
      isRead: false,
    },
    {
      id: 10,
      user: 'Mia Thompson',
      message: 'Looking for a TV stand',
      date: '2024-09-09T15:40:00Z',
      isRead: true,
    },
  ]);
  const { unreadCount, setUnreadCount } = useUnreadCount();
  useEffect(() => {
    // Sort notifications by date in descending order
    const sortedNotifications = [...notifications].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setNotifications(sortedNotifications);
     // Update unread count
    const count = sortedNotifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications, setUnreadCount]);
  return (
    <div style={styles.container}>
      <div style={styles.notifications}>
        {notifications.map((notification) => (
          <div key={notification.id} style={styles.notification}>
            <div style={styles.header}>
            {!notification.isRead && <div style={styles.unreadDot}></div>} 
              <div style={styles.user}>{notification.user}</div>
              <div style={styles.date}>
                {new Date(notification.date).toLocaleString()}
              </div>
            </div>
            <div style={styles.message}>{notification.message}</div>
            <button style={styles.contactButton}>Contact</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '100vw',
    backgroundColor: '#f5f8fa',
    fontFamily: 'Arial, sans-serif',
  },
  unreadCount: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  notifications: {
    display: 'grid',
    gap: '1rem',
  },
  notification: {
    padding: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  user: {
    fontWeight: 'bold',
  },
  date: {
    color: '#657786',
  },
  unreadDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#1da1f2',
    borderRadius: '50%',
    marginLeft: '10px',
    float: 'left',
  },
  message: {
    marginBottom: '1rem',
    color: '#333',
  },
  contactButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default Notifications;