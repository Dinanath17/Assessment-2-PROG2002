document.addEventListener('DOMContentLoaded', () => {  // Wait until the HTML is fully loaded
    const fundraiserDetails = document.getElementById('fundraiser-details');  // Get the section for fundraiser details
    const urlParams = new URLSearchParams(window.location.search);  // Get URL parameters
    const fundraiserId = urlParams.get('id');  // Get the 'id' from the URL

    console.log('Fundraiser ID:', fundraiserId);  // Log the ID for checking

    // If a fundraiser ID is provided, fetch the details for that fundraiser
    if (fundraiserId) {
        fetch(`http://localhost:3000/fundraiser/${fundraiserId}`)  // Request details for specific fundraiser
            .then(response => response.json())  // Convert response to JSON
            .then(data => {
                console.log('Fundraiser data:', data);  // Log the fetched data

                // Clear the details area before adding new information
                fundraiserDetails.innerHTML = '';

                // Check if the data is valid
                if (data && data.data) {
                    const fundraiser = data.data;  // Get the fundraiser data

                    const fundraiserCard = document.createElement('div');  // Create a new div for the fundraiser
                    fundraiserCard.classList.add('fundraiser-card');  // Add a class for styling

                    fundraiserCard.innerHTML = `
                        <h3>${fundraiser.CAPTION}</h3>  <!-- Fundraiser title -->
                        <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>  <!-- Organizer name -->
                        <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>  <!-- Target amount -->
                        <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>  <!-- Current amount -->
                        <p><strong>City:</strong> ${fundraiser.CITY}</p>  <!-- Fundraiser city -->
                        <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>  <!-- Category name -->
                    `;

                    fundraiserDetails.appendChild(fundraiserCard);  // Add the new card to the details section
                } else {
                    fundraiserDetails.innerHTML = '<p>No fundraiser found.</p>';  // Show message if no fundraiser
                }
            })
            .catch(error => {
                console.error('Error fetching fundraiser details:', error);  // Log any error
                fundraiserDetails.innerHTML = '<p>Error loading fundraiser details.</p>';  // Show error message
            });
    } else {
        // If no fundraiser ID is given, fetch all fundraisers
        fetch(`http://localhost:3000/fundraisers`)  // Request all fundraisers
            .then(response => response.json())  // Convert response to JSON
            .then(data => {
                console.log('All fundraisers data:', data);  // Log the fetched data

                // Clear the details area before adding new information
                fundraiserDetails.innerHTML = '';

                // Check if there are any fundraisers
                if (data && data.data && data.data.length > 0) {
                    data.data.forEach(fundraiser => {  // Loop through each fundraiser
                        const fundraiserCard = document.createElement('div');  // Create a new div for each fundraiser
                        fundraiserCard.classList.add('fundraiser-card');  // Add a class for styling

                        fundraiserCard.innerHTML = `
                            <h3>${fundraiser.CAPTION}</h3>  <!-- Fundraiser title -->
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>  <!-- Organizer name -->
                            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>  <!-- Target amount -->
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>  <!-- Current amount -->
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>  <!-- Fundraiser city -->
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>  <!-- Category name -->
                            <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>  <!-- Link to details -->
                        `;

                        fundraiserDetails.appendChild(fundraiserCard);  // Add the card to the details section
                    });
                } else {
                    fundraiserDetails.innerHTML = '<p>No fundraisers found.</p>';  // Show message if none found
                }
            })
            .catch(error => {
                console.error('Error fetching fundraisers:', error);  // Log any error
                fundraiserDetails.innerHTML = '<p>Error loading fundraisers.</p>';  // Show error message
            });
    }
});
