import * as tf from '@tensorflow/tfjs-node';

// Example: Creating a tensor
const tensor = tf.tensor([1, 2, 3, 4]);
tensor.print();
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Read and parse the dataset
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Create a simple TensorFlow model
export const createModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [12] })); // Input shape is [12]
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    return model;
};

// Train the model using the data
export const trainModel = async (model) => {
    console.log("Training the model...");

    const inputs = tf.tensor2d(data.map(item => [
        item.style === 'casual' ? 1 : 0, 
        item.bodyShape === 'pear' ? 1 : 0, 
        item.type === 'dress' ? 1 : 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0 // Placeholder for additional features (remove or modify these as needed)
    ]));
    
    const outputs = tf.tensor2d(data.map(item => [item.id])); // Target is item id

    await model.fit(inputs, outputs, { epochs: 10 });  // Reduced epochs for faster testing
    console.log("Model training complete.");
};

// Generate recommendations based on user preferences
export const recommend = async (model, userPreferences) => {
    const input = tf.tensor2d([[ 
        userPreferences.style === 'casual' ? 1 : 0, 
        userPreferences.bodyShape === 'pear' ? 1 : 0, 
        userPreferences.type === 'dress' ? 1 : 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0 // Placeholder for additional features (remove or modify these)
    ]]);
    
    const prediction = model.predict(input);
    const predictedId = Math.round(prediction.dataSync()[0]);

    console.log("Predicted Recommendation ID:", predictedId);  // Log prediction for debugging
    return [predictedId];
};
