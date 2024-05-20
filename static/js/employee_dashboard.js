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












document.addEventListener('DOMContentLoaded', function () {
    const itemInput = document.getElementById('item');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const totalInput = document.getElementById('total');
    const resultsDropdown = document.getElementById('results-dropdown');
    const addItemButton = document.getElementById('add-item-button');
    const previewTableBody = document.getElementById('preview-table').querySelector('tbody');
    const submitSaleButton = document.getElementById('submit-sale-button');

    let saleItems = [];

    function updateTotal() {
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);
        if (!isNaN(price) && !isNaN(quantity)) {
            totalInput.value = (price * quantity).toFixed(2);
        } else {
            totalInput.value = '';
        }
    }

    itemInput.addEventListener('input', function () {
        const query = itemInput.value;
        if (query.length > 1) {
            fetch(`/search_product?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    resultsDropdown.innerHTML = '';
                    if (data.length > 0) {
                        data.forEach(product => {
                            const option = document.createElement('div');
                            option.className = 'dropdown-item';
                            option.textContent = product.name;
                            option.dataset.price = product.price;
                            option.dataset.quantity = product.quantity;
                            option.addEventListener('click', function () {
                                itemInput.value = product.name;
                                priceInput.value = product.price;
                                quantityInput.value = 1; // Default quantity to 1
                                updateTotal(); // Update total when an item is selected
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

    document.addEventListener('click', function (e) {
        if (!resultsDropdown.contains(e.target) && e.target !== itemInput) {
            resultsDropdown.innerHTML = '';
            resultsDropdown.classList.remove('show');
        }
    });

    priceInput.addEventListener('input', updateTotal);
    quantityInput.addEventListener('input', updateTotal);

    addItemButton.addEventListener('click', function () {
        const item = itemInput.value;
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);
        const date = document.getElementById('date').value;
        const total = parseFloat(totalInput.value);

        if (item && !isNaN(price) && !isNaN(quantity) && !isNaN(total) && date) {
            saleItems.push({ item, price, quantity, total, date });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item}</td>
                <td>${price.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${total.toFixed(2)}</td>
                <td><button class="edit-button">Edit</button> <button class="delete-button">Delete</button></td>
            `;

            row.querySelector('.edit-button').addEventListener('click', function () {
                itemInput.value = item;
                priceInput.value = price;
                quantityInput.value = quantity;
                document.getElementById('date').value = date;
                updateTotal();
                saleItems = saleItems.filter(s => s.item !== item || s.date !== date);
                row.remove();
            });

            row.querySelector('.delete-button').addEventListener('click', function () {
                saleItems = saleItems.filter(s => s.item !== item || s.date !== date);
                row.remove();
            });

            previewTableBody.appendChild(row);

            itemInput.value = '';
            priceInput.value = '';
            quantityInput.value = '';
            totalInput.value = '';
            document.getElementById('date').value = document.getElementById('date').defaultValue;
        } else {
            alert('Please fill out all fields.');
        }
    });

    submitSaleButton.addEventListener('click', function () {
        if (saleItems.length > 0) {
            fetch('/employee_add_sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value
                },
                body: JSON.stringify(saleItems)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Sale added successfully!');
                    location.reload();
                } else {
                    alert('Error adding sale: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert('No items to submit.');
        }
    });
});

