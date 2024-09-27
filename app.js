const express = require('express');  // Import the express framework
const mysql = require('mysql2');  // Import mysql2 for database connections
const cors = require('cors');  // Import cors to handle cross-origin requests
const app = express();  // Create an express application
const port = 3000;  // API server port

// Use CORS for cross-origin requests
app.use(cors());  // Allow requests from other origins

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',  // Database host
    user: 'root',  // Database user
    password: 'Dinanath#001',  // Database password
    database: 'crowdfunding_db'  // Database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);  // Log connection error
        return;  // Stop execution if there is an error
    }
    console.log('Connected to MySQL');  // Log success message
});

// Define the root route
app.get('/', (req, res) => {
    res.send('Welcome to the Crowdfunding API. Use /fundraisers or /fundraiser/:id');  // Send welcome message
});

// API route to fetch all fundraisers
app.get('/fundraisers', (req, res) => {
    const query = `
        SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME
        FROM FUNDRAISER
        JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
        WHERE FUNDRAISER.ACTIVE = TRUE
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);  // Log any errors
            res.status(500).json({ error: 'Failed to fetch data' });  // Send error response
        } else {
            // Map results to include ACTIVE_STATUS
            const response = results.map(fundraiser => ({
                FUNDRAISER_ID: fundraiser.FUNDRAISER_ID,  // Fundraiser ID
                ORGANIZER: fundraiser.ORGANIZER,  // Organizer name
                CAPTION: fundraiser.CAPTION,  // Fundraiser title
                TARGET_FUNDING: fundraiser.TARGET_FUNDING,  // Target funding amount
                CURRENT_FUNDING: fundraiser.CURRENT_FUNDING,  // Current funding amount
                CITY: fundraiser.CITY,  // Fundraiser city
                ACTIVE_STATUS: fundraiser.ACTIVE ? 'Active' : 'Inactive',  // Active status as string
                CATEGORY_ID: fundraiser.CATEGORY_ID,  // Category ID
                CATEGORY_NAME: fundraiser.CATEGORY_NAME  // Category name
            }));
            res.json({ data: response });  // Send the response as JSON
        }
    });
});

// API route to fetch a specific fundraiser by ID
app.get('/fundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id;  // Get the ID from the URL
    const query = `
        SELECT FUNDRAISER.FUNDRAISER_ID, FUNDRAISER.ORGANIZER, FUNDRAISER.CAPTION,
               FUNDRAISER.TARGET_FUNDING, FUNDRAISER.CURRENT_FUNDING, FUNDRAISER.CITY,
               FUNDRAISER.ACTIVE, CATEGORY.NAME AS CATEGORY_NAME
        FROM FUNDRAISER
        JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
        WHERE FUNDRAISER.FUNDRAISER_ID = ?;
    `;

    db.query(query, [fundraiserId], (err, results) => {
        if (err) {
            console.error('Error fetching fundraiser details:', err);  // Log any errors
            res.status(500).json({ error: 'Failed to fetch fundraiser details' });  // Send error response
        } else {
            if (results.length > 0) {
                const fundraiser = results[0];  // Get the first result
                res.json({
                    data: {
                        FUNDRAISER_ID: fundraiser.FUNDRAISER_ID,  // Fundraiser ID
                        ORGANIZER: fundraiser.ORGANIZER,  // Organizer name
                        CAPTION: fundraiser.CAPTION,  // Fundraiser title
                        TARGET_FUNDING: fundraiser.TARGET_FUNDING,  // Target funding amount
                        CURRENT_FUNDING: fundraiser.CURRENT_FUNDING,  // Current funding amount
                        CITY: fundraiser.CITY,  // Fundraiser city
                        ACTIVE_STATUS: fundraiser.ACTIVE ? 'Active' : 'Inactive',  // Active status as string
                        CATEGORY_NAME: fundraiser.CATEGORY_NAME  // Category name
                    }
                });
            } else {
                res.status(404).json({ error: 'Fundraiser not found' });  // Send not found error
            }
        }
    });
});

// API route to fetch categories
app.get('/categories', (req, res) => {
    const query = 'SELECT DISTINCT CATEGORY_ID, NAME FROM CATEGORY';  // Query to get distinct categories

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);  // Log any errors
            res.status(500).json({ error: 'Failed to fetch categories' });  // Send error response
        } else {
            res.json({ data: results });  // Send categories as JSON
        }
    });
});

// API route to search for fundraisers
app.get('/search', (req, res) => {
    const { organizer, city, category } = req.query;  // Get search criteria from query parameters

    let query = `
        SELECT FUNDRAISER.FUNDRAISER_ID, FUNDRAISER.ORGANIZER, FUNDRAISER.CAPTION,
               FUNDRAISER.TARGET_FUNDING, FUNDRAISER.CURRENT_FUNDING, FUNDRAISER.CITY,
               CATEGORY.NAME AS CATEGORY_NAME
        FROM FUNDRAISER
        JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
        WHERE FUNDRAISER.ACTIVE = TRUE
    `;

    const params = [];  // Array to hold query parameters

    if (organizer) {  // If organizer is provided
        query += ' AND FUNDRAISER.ORGANIZER LIKE ?';  // Filter by organizer
        params.push(`%${organizer}%`);  // Add to parameters
    }

    if (city) {  // If city is provided
        query += ' AND FUNDRAISER.CITY LIKE ?';  // Filter by city
        params.push(`%${city}%`);  // Add to parameters
    }

    if (category) {  // If category is provided
        query += ' AND CATEGORY.NAME = ?';  // Filter by category
        params.push(category);  // Add to parameters
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching fundraisers:', err);  // Log any errors
            res.status(500).json({ error: 'Failed to search fundraisers' });  // Send error response
        } else {
            res.json({ data: results });  // Send search results as JSON
        }
    });
});

// Start the API server on port 3000
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);  // Log server address
});
