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

    // Optionally add a dropdown or input for condition (e.g., new, used, refurbished)
    const condition = document.querySelector('#condition-select')?.value || 'any';

    // Display a loading message
    displayResults(`Searching for "${keyword}"...`);

    // Fetch data from the backend API
    fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&condition=${encodeURIComponent(condition)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
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
            console.error(error);
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
    
    // Create an image element for the product image
    const productImage = document.createElement('img');
    productImage.src = item.image || 'placeholder.png'; // Default image if none provided
    productImage.alt = item.title || 'Product Image';  // Product title as alt text
    productImage.classList.add('product-image');
    
    // Create a title element
    const title = document.createElement('h3');
    title.textContent = item.title || 'No title available';
    
    // Create a price element
    const price = document.createElement('p');
    price.textContent = `Price: $${item.price || 'N/A'}`;
    
    // Create a suggested price element (from the backend's analysis)
    const suggestedPrice = document.createElement('p');
    suggestedPrice.textContent = `Suggested Selling Price: $${item.suggestedPrice || 'N/A'}`;
    suggestedPrice.style.fontWeight = 'bold';
    suggestedPrice.style.color = '#4CAF50';

    // Create a description element
    const description = document.createElement('p');
    description.textContent = item.description || 'No description available';
    
    // Optionally, create a link to the product page (if available)
    const productLink = document.createElement('a');
    productLink.href = item.url || '#'; // Use # if URL is not available
    productLink.textContent = "View Product";
    productLink.target = "_blank"; // Open in a new tab
    
    // Append all elements to the result item container
    resultItem.appendChild(productImage);
    resultItem.appendChild(title);
    resultItem.appendChild(price);
    resultItem.appendChild(suggestedPrice);
    resultItem.appendChild(description);
    resultItem.appendChild(productLink);
    
    // Append the result item to the results section
    resultsSection.appendChild(resultItem);
}