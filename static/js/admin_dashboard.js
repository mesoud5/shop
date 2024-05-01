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




// admin_dashboard.js

// Sample data for top sales
const topSalesData = [
    { name: "Product A", price: "$50" },
    { name: "Product B", price: "$40" },
    { name: "Product C", price: "$35" },
    { name: "Product D", price: "$30" },
    { name: "Product E", price: "$25" }
];

// Function to display top sales
function displayTopSales() {
    const topSalesContainer = document.getElementById("topSalesContainer");

    // Clear previous content
    topSalesContainer.innerHTML = "";

    // Loop through top sales data and create HTML elements
    topSalesData.forEach(item => {
        const saleItem = document.createElement("div");
        saleItem.classList.add("saleItem");
        saleItem.innerHTML = `<strong>${item.name}</strong>: ${item.price}`;
        topSalesContainer.appendChild(saleItem);
    });
}

// Call the function to display top sales
displayTopSales();
