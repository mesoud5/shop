document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get username and password from the form
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Hardcoded credentials for admin and employee
    var adminCredentials = { username: 'admin', password: 'mesoud123' };
    var employeeCredentials = { username: 'ekram', password: 'ekram123' };

    // Check if the entered credentials match admin or employee
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Redirect to admin dashboard
        window.location.href = '../templates/admin_dashboard.html';
    } else if (username === employeeCredentials.username && password === employeeCredentials.password) {
        // Redirect to employee dashboard
        window.location.href = '../templates/employee_dashboard.html';
    } else {
        // Display error message for invalid credentials
        document.getElementById('error-message').textContent = 'Invalid username or password. Please try again.';
    }
});
