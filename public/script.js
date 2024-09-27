// script.js - General Purpose JavaScript for Shared Functionality

// Function to highlight the active menu item
function setActiveMenu() {
    const currentPath = window.location.pathname;  // Get the current page path
    const menuItems = document.querySelectorAll('nav ul li a');  // Get all menu links

    menuItems.forEach(item => {  // Loop through each menu item
        if (item.getAttribute('href') === currentPath) {  // Check if the link matches the current path
            item.classList.add('active');  // Add 'active' class for styling
        } else {
            item.classList.remove('active');  // Remove 'active' class if it doesn't match
        }
    });
}

// Error handling function for API requests
function handleApiError(error) {
    console.error('API request failed:', error);  // Log the error
    alert('Something went wrong. Please try again later.');  // Show alert to user
}

// Call this function when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    setActiveMenu(); // Highlight the active menu item when the page loads
});

// Utility function to format currency (e.g., for showing funding amounts)
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;  // Format the amount as currency
}
