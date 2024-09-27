document.addEventListener('DOMContentLoaded', () => {  // Wait until the HTML is fully loaded
    const fundraiserList = document.getElementById('fundraisers-list');  // Get the section for fundraisers

    // Fetch the active fundraisers from the API
    fetch('http://localhost:3000/fundraisers')  // Request all fundraisers
        .then(response => response.json())  // Convert response to JSON
        .then(data => {
            // Clear the container before adding new fundraisers
            fundraiserList.innerHTML = '';  // Empty the section

            data.data.forEach(fundraiser => {  // Loop through each fundraiser
                const fundraiserCard = document.createElement('div');  // Create a new div for the fundraiser
                fundraiserCard.classList.add('fundraiser-card');  // Add a class for styling

                // Add a link to the fundraiser details page with the correct ID
                fundraiserCard.innerHTML = `
                    <h3>${fundraiser.CAPTION}</h3>  <!-- Fundraiser title -->
                    <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>  <!-- Organizer name -->
                    <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>  <!-- Target amount -->
                    <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>  <!-- Current amount -->
                    <p><strong>City:</strong> ${fundraiser.CITY}</p>  <!-- Fundraiser city -->
                    <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>  <!-- Category name -->
                    <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a>  <!-- Link to details -->
                `;

                fundraiserList.appendChild(fundraiserCard);  // Add the new card to the section
            });
        })
        .catch(error => console.error('Error fetching fundraisers:', error));  // Log any errors
});
