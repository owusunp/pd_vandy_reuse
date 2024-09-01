const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making API calls to GPT-3
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

const app = express();
app.use(bodyParser.json());

let items = []; // Simulated database

// Endpoint to classify item and add to the database
app.post('/add-item', async (req, res) => {
    const { title, description, price, image } = req.body;

    try {
        // Call GPT-3 API for categorization
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
            category
        };

        items.push(newItem); // Add to the "database"
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
