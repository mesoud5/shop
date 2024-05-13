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




// Function to reload the admin dashboard page
function reloadAdminDashboard() {
    window.location.reload();
}

// Get the dashboard link
const dashboardLink = document.getElementById("dashboardLink");

// Add event listener to reload the admin dashboard page when the link is clicked
dashboardLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior of link (which is to navigate)
    reloadAdminDashboard();
});



// Function to handle click event on manage categories
function manageCategories() {
    // Redirect to manage categories page or display/manage categories here
    console.log("Manage Categories clicked");
}

// Function to handle click event on add category
function addCategory() {
    // Redirect to add category page or display add category form here
    console.log("Add Category clicked");
}

// Get the categories dropdown and its links
const categoriesDropdown = document.getElementById("categoriesDropdown");
const manageCategoriesLink = document.getElementById("manageCategories");
const addCategoryLink = document.getElementById("addCategory");

// Add event listeners to dropdown links
manageCategoriesLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior of link
    manageCategories();
});

addCategoryLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior of link
    addCategory();
});
