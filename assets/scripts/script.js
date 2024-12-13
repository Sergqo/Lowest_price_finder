// Select the necessary DOM elements
const form = document.querySelector('form');
const inputField = document.querySelector('form input[type="text"]');
const resultsSection = document.querySelector('.results-section');

// Add an event listener for form submission
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the user input value
    const keyword = inputField.value.trim();

    // Check if the input is empty
    if (keyword === '') {
        alert('Please enter a keyword!');
        return;
    }

    // Display a loading message
    displayResults(`Searching for "${keyword}"...`);

    // Fetch data from the backend API
    fetch(`http://localhost:5000/api/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data); // Debugging statement
            // Check if the backend returned any products
            const products = data.products || [];
            if (products.length > 0) {
                // Display results for the keyword
                displayResults(`Results for "${keyword}":`);
                // Loop through the products and display them
                products.forEach(item => addResultItem(item));
            } else {
                // No results found for the keyword
                displayResults(`No results found for "${keyword}".`);
            }
        })
        .catch(error => {
            // Handle any errors during the fetch
            displayResults("An error occurred while fetching results.");
            console.error('Fetch error:', error); // Debugging statement
        });
});

// Function to display a message in the results section
function displayResults(message) {
    resultsSection.innerHTML = `<p>${message}</p>`;
}

// Function to add individual result items with more details (image, price, description, and suggested price)
function addResultItem(item) {
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');

    // Create a title element
    const title = document.createElement('h3');
    title.textContent = item.name || 'No title available';
    
    // Create a price element
    const price = document.createElement('p');
    price.textContent = `Price: $${item.price || 'N/A'}`;

    const website = document.createElement('p');
    website.textContent = `Website: ${item.used_API || 'N/A'}`;
    
    // Optionally, create a link to the product page (if available)
    const productLink = document.createElement('a');
    productLink.href = item.url || '#'; // Use # if URL is not available
    productLink.textContent = "View Product";
    productLink.target = "_blank"; // Open in a new tab
    
    // Append all elements to the result item container
    resultItem.appendChild(title);
    resultItem.appendChild(price);
    resultItem.appendChild(website);
    resultItem.appendChild(productLink);
    
    // Append the result item to the results section
    resultsSection.appendChild(resultItem);
}