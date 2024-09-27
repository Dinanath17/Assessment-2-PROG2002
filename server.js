const express = require('express');  // Import the express framework
const path = require('path');  // Import path module for file handling
const app = express();  // Create an express application
const port = 4000;  // Set the port for serving static files

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));  // Serve files in the public folder

// Redirect the root path ("/") to the homepage
app.get('/', (req, res) => {
    res.redirect('/homepage.html');  // Automatically load homepage.html when accessing root
});

// Start the static file server on port 4000
app.listen(port, () => {
    console.log(`Static file server running at http://localhost:${port}`);  // Log the server address
});
