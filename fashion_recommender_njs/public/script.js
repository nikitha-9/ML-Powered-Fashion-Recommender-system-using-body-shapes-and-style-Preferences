document.getElementById('recommendation-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const style = document.getElementById('style').value;
    const bodyShape = document.getElementById('bodyShape').value;
    const type = document.getElementById('type').value;

    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ style, bodyShape, type }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendation');
        }

        const data = await response.json();
        console.log('Server response:', data); // Log server response

        if (data.recommendations) {
            const recommendedId = data.recommendations[0]; // Get the recommended ID
            // Redirect to a new page with the recommended ID as a query parameter
            window.location.href = `/recommendation.html?id=${recommendedId}`;
        } else {
            document.getElementById('recommended-id').textContent = 'No recommendation available.';
        }
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        document.getElementById('recommended-id').textContent = 'Error fetching recommendation.';
    }
});
