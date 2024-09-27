document.addEventListener('DOMContentLoaded', () => {  // Wait until the HTML is fully loaded
    const categorySelect = document.getElementById('category');  // Get the category dropdown
    const searchButton = document.getElementById('search-button');  // Get the search button
    const clearButton = document.getElementById('clear-button');  // Get the clear button
    const searchResults = document.getElementById('search-results');  // Get the section for search results

    console.log('Page loaded, fetching categories...'); // Log to confirm the page has loaded

    // Fetch available categories for the dropdown
    fetch('http://localhost:3000/categories')  // Request the categories from the API
        .then(response => response.json())  // Convert response to JSON
        .then(data => {
            console.log('Categories fetched:', data);  // Log the fetched categories

            // Clear existing options to avoid duplicates
            categorySelect.innerHTML = '';  // Empty the dropdown

            // Add a default "Select a category" option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';  // No value for default
            defaultOption.textContent = 'Select a Category';  // Default text
            categorySelect.appendChild(defaultOption);  // Add default option to dropdown

            // Add fetched categories to the dropdown
            data.data.forEach(category => {
                console.log('Appending category:', category.NAME); // Log each category being added
                const option = document.createElement('option');  // Create a new option
                option.value = category.CATEGORY_ID;  // Use category ID as value
                option.textContent = category.NAME;  // Display category name
                categorySelect.appendChild(option);  // Add option to dropdown
            });
        })
        .catch(error => console.error('Error fetching categories:', error));  // Log any errors

    // Function to perform the search based on input criteria
    searchButton.addEventListener('click', () => {
        const organizer = document.getElementById('organizer').value;  // Get organizer input
        const city = document.getElementById('city').value;  // Get city input
        const category = document.getElementById('category').value;  // Get selected category

        // Create query parameters for the search
        const queryParams = new URLSearchParams();
        if (organizer) queryParams.append('organizer', organizer);  // Add organizer to params
        if (city) queryParams.append('city', city);  // Add city to params
        if (category) queryParams.append('category', category);  // Add category to params

        console.log('Fetching search results with parameters:', queryParams.toString()); // Log the parameters

        // Fetch fundraisers based on the search criteria
        fetch(`http://localhost:3000/search?${queryParams.toString()}`)  // Request search results
            .then(response => response.json())  // Convert response to JSON
            .then(data => {
                console.log('Search results fetched:', data);  // Log the search results

                // Clear previous search results
                searchResults.innerHTML = '';  // Empty the results section

                if (data.data && data.data.length > 0) {  // Check if there are results
                    data.data.forEach(fundraiser => {  // Loop through each fundraiser
                        const resultCard = document.createElement('div');  // Create a new div for each result
                        resultCard.classList.add('fundraiser-card');  // Add a class for styling

                        resultCard.innerHTML = `
                            <h3>${fundraiser.CAPTION}</h3>  <!-- Fundraiser title -->
                            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>  <!-- Organizer name -->
                            <p><strong>City:</strong> ${fundraiser.CITY}</p>  <!-- Fundraiser city -->
                            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>  <!-- Category name -->
                            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>  <!-- Target amount -->
                            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>  <!-- Current amount -->
                            <button onclick="window.location.href='fundraiser.html?id=${fundraiser.FUNDRAISER_ID}'">View Details</button>  <!-- Button to view details -->
                        `;

                        searchResults.appendChild(resultCard);  // Add the result card to the section
                    });
                } else {
                    searchResults.innerHTML = '<p>No fundraisers found matching your criteria.</p>';  // Message if no results
                }
            })
            .catch(error => console.error('Error fetching search results:', error));  // Log any errors
    });

    // Clear the search form when the clear button is clicked
    clearButton.addEventListener('click', () => {
        document.getElementById('organizer').value = '';  // Clear organizer input
        document.getElementById('city').value = '';  // Clear city input
        document.getElementById('category').value = '';  // Reset category selection
        searchResults.innerHTML = ''; // Clear previous results
    });
});
