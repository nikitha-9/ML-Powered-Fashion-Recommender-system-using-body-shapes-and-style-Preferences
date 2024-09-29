import express from 'express';
import { createModel, trainModel, recommend } from './model.mjs';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

let model;

// Train the model when the server starts
const initializeModel = async () => {
    model = createModel();
    console.log('Model created.');
    await trainModel(model);
    console.log('Model training completed.');
};

initializeModel();

// Endpoint for recommendations
app.post('/recommend', async (req, res) => {
    const userPreferences = req.body;

    try {
        console.log('Received user preferences:', userPreferences);  // Log user input for debugging
        const recommendations = await recommend(model, userPreferences);
        res.json({ recommendations });
    } catch (error) {
        console.error('Error in /recommend:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve the recommendation.html file for recommendation page
app.get('/recommendation.html', (req, res) => {
    res.sendFile(path.resolve('public/recommendation.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
