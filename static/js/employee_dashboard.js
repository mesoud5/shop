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

