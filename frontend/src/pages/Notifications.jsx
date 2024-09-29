import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUnreadCount } from '../UnreadCountContext';

const Notifications = () => {
  const [sellingNotifications, setSellingNotifications] = useState([]);
  const [buyingNotifications, setBuyingNotifications] = useState([]);
  const [filter, setFilter] = useState('Selling');
  const { setUnreadCount } = useUnreadCount();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/notifications/');
        if (response.status === 200) {
          setBuyingNotifications(response.data.buy_notifications);
          setSellingNotifications(response.data.sell_notifications);
          //console log both buying and selling notifications
          console.log(response.data.buy_notifications);
          console.log(response.data.sell_notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        alert('Error fetching notifications');
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    // Update unread count
    const count = [...sellingNotifications, ...buyingNotifications].filter(notification => !notification.is_read).length;
    setUnreadCount(count);
  }, [sellingNotifications, buyingNotifications, setUnreadCount]);

  const notificationsToDisplay = (filter === 'Buying' ? buyingNotifications : sellingNotifications)
    .slice()
    .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));

  const [newNotification, setNewNotification] = useState({
    poster: '',
    description: '',
    date_posted: new Date().toISOString(),
    is_read: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification({ ...newNotification, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/notifications/buy_notification', newNotification);
      if (response.status === 200) {
        const newNotificationWithId = { ...newNotification, _id: response.data };
        const updatedNotifications = [...buyingNotifications, newNotificationWithId];
        setBuyingNotifications(updatedNotifications);
        setNewNotification({
          poster: '',
          description: '',
          date_posted: new Date().toISOString(),
          is_read: false,
        });
        alert('Notification posted successfully');
      }
    } catch (error) {
      console.error('Error posting notification:', error);
      alert('Error posting notification');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        const updatedNotification = { ...notification, is_read: true };
        const response = await axios.put(`http://127.0.0.1:8000/api/v1/notifications/${notification._id}`, updatedNotification);
        if (response.status === 200) {
          if (filter === 'Buying') {
            setBuyingNotifications((prev) =>
              prev.map((notif) => (notif._id === notification._id ? updatedNotification : notif))
            );
          } else {
            setSellingNotifications((prev) =>
              prev.map((notif) => (notif._id === notification._id ? updatedNotification : notif))
            );
          }
        }
      } catch (error) {
        console.error('Error updating notification:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>
      <div style={styles.filterContainer}>
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.dropdown}
        >
          <option value="Buying">Buying</option>
          <option value="Selling">Selling</option>
        </select>
      </div>
      <div style={styles.notifications}>
        {notificationsToDisplay.map((notification) => (
          <div
            key={notification._id}
            style={styles.notification}
            onClick={() => handleNotificationClick(notification)}
          >
            <div style={styles.header}>
              <div style={styles.user}>{notification.poster}</div>
              <div style={styles.date}>
                {new Date(notification.date_posted).toLocaleString()}
              </div>
            </div>
            <div style={!notification.is_read ? styles.boldMessage : styles.message}>
              {notification.description}
            </div>
            <button style={styles.contactButton}>Contact</button>
          </div>
        ))}
      </div>
        {filter === "Buying" && <div style = {styles.formContainer}><h2 style={styles.formTitle}>Post a New Request</h2><form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="poster"
            value={newNotification.poster}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
            style={styles.input}
          />
          <textarea
            name="description"
            value={newNotification.description}
            onChange={handleInputChange}
            placeholder="What are you looking for?"
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.submitButton}>Post</button>
        </form></div>}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '100vw',
    backgroundColor: '#f5f8fa',
    fontFamily: 'Arial, sans-serif',
    marginTop: '50px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  dropdown: {
    marginLeft: '0.5rem',
    padding: '0.5rem',
    fontSize: '1rem',
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
    cursor: 'pointer',
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
  },
  message: {
    marginBottom: '1rem',
    color: '#333',
  },
  boldMessage: {
    marginBottom: '1rem',
    color: '#333',
    fontWeight: 'bold',
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
  formContainer: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #e1e8ed',
  },
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #e1e8ed',
    resize: 'vertical',
  },
  submitButton: {
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