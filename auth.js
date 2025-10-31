document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorDisplay = document.getElementById('register-error');

    // Helper function for basic email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function for simple 10-digit phone number check
    function isValidPhone(phone) {
        const phoneRegex = /^\d{10}$/; 
        // Allow empty if not required, but since it's required now, we check the format
        return phoneRegex.test(phone);
    }

    // ======================================================
    //                 HANDLE REGISTRATION
    // ======================================================
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDisplay.textContent = ''; // Clear previous errors

            // 1. Capture All Field Values
            const fullName = document.getElementById('full-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 2. Perform Validation Checks
            
            // Check 1: Passwords Match
            if (password !== confirmPassword) {
                errorDisplay.textContent = 'Error: Passwords do not match.';
                return;
            }
            
            // Check 2: Basic Password Strength (Example)
            if (password.length < 6) {
                errorDisplay.textContent = 'Error: Password must be at least 6 characters long.';
                return;
            }
            
            // Check 3: Email Format
            if (!isValidEmail(email)) {
                errorDisplay.textContent = 'Error: Please enter a valid email address.';
                return;
            }

            // Check 4: Phone Number Format (Now compulsory)
            if (!isValidPhone(phone)) {
                errorDisplay.textContent = 'Error: Please enter a valid 10-digit phone number.';
                return;
            }
            
            // Check 5: Username/Email Uniqueness
            const users = JSON.parse(localStorage.getItem('qrScannerUsers')) || [];
            
            const userExists = users.some(user => 
                user.username === username || user.email === email
            );

            if (userExists) {
                errorDisplay.textContent = 'Error: Username or Email already registered.';
                return;
            }

            // 3. Save User Data
            users.push({ 
                fullName, 
                email, 
                phone, 
                username, 
                password 
            });
            localStorage.setItem('qrScannerUsers', JSON.stringify(users));
            
            alert('Registration successful! Please log in with your new account.');
            window.location.href = 'index.html'; // Redirect to login page
        });
    }

    // ======================================================
    //                 HANDLE LOGIN
    // ======================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('qrScannerUsers')) || [];

            // Find a user that matches either username OR email and the password
            const validUser = users.find(user => 
                (user.username === usernameInput || user.email === usernameInput) && user.password === password
            );

            if (validUser) {
                // Store logged-in user session
                localStorage.setItem('loggedInUser', validUser.username); // Use the actual username for display
                alert('Login successful!');
                window.location.href = 'scanner.html'; // Redirect to scanner page
            } else {
                alert('Invalid credentials. Check username/email and password.');
            }
        });
    }
});