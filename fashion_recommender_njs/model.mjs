import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Read and parse the dataset
const data = JSON.parse(fs.readFileSync('./public/data.json', 'utf8'));

// Function to one-hot encode categorical variables
const oneHotEncode = (value, categories) => {
    const encoding = Array(categories.length).fill(0);
    const index = categories.indexOf(value);
    if (index !== -1) encoding[index] = 1;
    return encoding;
};

// Available categories for each feature
const styles = ['casual', 'formal', 'sporty', 'bohemian', 'party', 'summer'];
const bodyShapes = ['pear', 'apple', 'rectangle', 'hourglass', 'triangle', 'oval'];
const types = ['dress', 'top', 'pants', 'skirt', 'jacket', 'shorts', 'sweater', 'blazer', 'jeans', 'overall', 'culottes', 'maxi dress'];

// Create a simple TensorFlow model
export const createModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [styles.length + bodyShapes.length + types.length] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: data.length, activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });
    return model;
};

// Train the model using the data
export const trainModel = async (model) => {
    console.log("Training the model...");

    const inputs = tf.tensor2d(data.map(item => [
        ...oneHotEncode(item.style, styles),
        ...oneHotEncode(item.bodyShape, bodyShapes),
        ...oneHotEncode(item.type, types)
    ]));

    const outputs = tf.tensor2d(data.map(item => {
        const output = Array(data.length).fill(0);
        output[item.id - 1] = 1;  
        return output;
    }));

    await model.fit(inputs, outputs, { epochs: 50 });
    console.log("Model training complete.");
};

// Generate recommendations based on user preferences
export const recommend = async (model, userPreferences) => {
    const input = tf.tensor2d([[ 
        ...oneHotEncode(userPreferences.style, styles),
        ...oneHotEncode(userPreferences.bodyShape, bodyShapes),
        ...oneHotEncode(userPreferences.type, types)
    ]]);

    const prediction = model.predict(input);
    const predictedIdIndex = prediction.argMax(-1).dataSync()[0];  
    const predictedId = predictedIdIndex + 1;  

    console.log("Predicted Recommendation ID:", predictedId);
    return [predictedId];
};
