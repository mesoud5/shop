// Function to update the date in the header
function updateDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    options.timeZone = 'UTC'; // Set time zone to UTC
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    document.querySelector('.date').textContent = formattedDate;
}

// Call the function initially to set the date
updateDate();

// Update the date every second
setInterval(updateDate, 1000);


// Get all dropdown items
const dropdownItems = document.querySelectorAll('.dropdown');

// Loop through each dropdown item
dropdownItems.forEach(dropdown => {
    // Add event listener for when the dropdown is clicked
    dropdown.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from bubbling up to the document

        // Get the dropdown content
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        // If there is dropdown content
        if (dropdownContent) {
            // Toggle the display of the dropdown content
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            // Get the height of the dropdown content
            const dropdownContentHeight = dropdownContent.clientHeight;
            // Get the next sibling (the item below the dropdown)
            let nextSibling = dropdown.nextElementSibling;
            // If there is a next sibling and it's a list item
            if (nextSibling && nextSibling.tagName === 'LI') {
                // Adjust its margin
                nextSibling.style.marginTop = dropdownContent.style.display === 'block' ? `${dropdownContentHeight}px` : '0';
            }
        }
    });
});

// Add event listener to close dropdowns when clicking outside
document.addEventListener('click', (event) => {
    // Close dropdowns when clicking outside
    dropdownItems.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
                let nextSibling = dropdown.nextElementSibling;
                if (nextSibling && nextSibling.tagName === 'LI') {
                    nextSibling.style.marginTop = '0';
                }
            }
        }
    });
});





// Calculate total when price or quantity changes
document.getElementById('price').addEventListener('input', calculateTotal);
document.getElementById('quantity').addEventListener('input', calculateTotal);

function calculateTotal() {
    var price = parseFloat(document.getElementById('price').value);
    var quantity = parseFloat(document.getElementById('quantity').value);
    var total = isNaN(price) || isNaN(quantity) ? 0 : price * quantity;
    document.getElementById('total').value = total.toFixed(2);
}



document.addEventListener('DOMContentLoaded', function() {
    const itemInput = document.getElementById('item');
    const resultsDropdown = document.getElementById('results-dropdown');

    itemInput.addEventListener('input', function() {
        const query = itemInput.value;
        if (query.length > 1) {
            fetch(`/search_product?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    resultsDropdown.innerHTML = '';
                    data.forEach(product => {
                        const option = document.createElement('div');
                        option.className = 'dropdown-item';
                        option.textContent = product.name;
                        option.dataset.id = product.id;
                        option.dataset.price = product.price;
                        option.dataset.quantity = product.quantity;
                        option.addEventListener('click', function() {
                            itemInput.value = product.name;
                            document.getElementById('price').value = product.price;
                            document.getElementById('quantity').value = product.quantity;
                            resultsDropdown.innerHTML = '';
                        });
                        resultsDropdown.appendChild(option);
                    });
                });
        } else {
            resultsDropdown.innerHTML = '';
        }
    });
});




document.addEventListener('DOMContentLoaded', function() {
    const itemInput = document.getElementById('item');
    const resultsDropdown = document.getElementById('results-dropdown');

    itemInput.addEventListener('input', function() {
        const query = itemInput.value;
        if (query.length > 1) {
            fetch(`/search_product?q=${query}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    resultsDropdown.innerHTML = '';
                    if (data.length > 0) {
                        data.forEach(product => {
                            const option = document.createElement('div');
                            option.className = 'dropdown-item';
                            option.textContent = product.name;
                            option.dataset.price = product.price;
                            option.dataset.quantity = product.quantity;
                            option.addEventListener('click', function() {
                                itemInput.value = product.name;
                                document.getElementById('price').value = product.price;
                                document.getElementById('quantity').value = product.quantity;
                                resultsDropdown.innerHTML = '';
                            });
                            resultsDropdown.appendChild(option);
                        });
                        resultsDropdown.classList.add('show');
                    } else {
                        resultsDropdown.classList.remove('show');
                    }
                })
                .catch(error => {
                    console.error('Error fetching product data:', error);
                });
        } else {
            resultsDropdown.innerHTML = '';
            resultsDropdown.classList.remove('show');
        }
    });

    document.addEventListener('click', function(e) {
        if (!resultsDropdown.contains(e.target) && e.target !== itemInput) {
            resultsDropdown.innerHTML = '';
            resultsDropdown.classList.remove('show');
        }
    });
});
