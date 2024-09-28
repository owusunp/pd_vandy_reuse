// /Users/owusunp/pd_vandy_reuse/backend/server.js

require('dotenv').config();  // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StreamChat } = require('stream-chat');

// Initialize Stream client using environment variables
const streamClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_SECRET_KEY);

// In-memory stores (for demo purposes)
let items = [];
let users = {}; // Store users in-memory

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(bodyParser.json());

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };

    res.json({ message: 'User registered successfully' });
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const user = users[username];
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
  
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid password' });
    }
  
    // Generate JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  
    // Generate Stream token
    const streamToken = streamClient.createToken(username);
  
    res.json({ token, streamToken, username });
});

// Middleware to authenticate users using JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Endpoint to add item (requires authentication)
app.post('/add-item', authenticateJWT, async (req, res) => {
    const { title, description, price, image } = req.body;

    try {
        // Simulate item categorization using an API (you can replace this with actual GPT-3 call if needed)
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Classify the following product description: "${title} - ${description}" into categories like "Men", "Women", "Accessories", etc.`,
            max_tokens: 10,
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            }
        });

        const category = response.data.choices[0].text.trim();
        
        const newItem = {
            id: uuidv4(),
            title,
            description,
            price,
            image,
            category,
            seller: req.user.username, // Add seller info from authenticated user
        };

        items.push(newItem); // Add to "database"
        res.json(newItem);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error categorizing the item');
    }
});

// Endpoint to get all items
app.get('/items', (req, res) => {
    res.json(items);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
