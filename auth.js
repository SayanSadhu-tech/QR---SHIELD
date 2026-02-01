document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('login-username');
    
    // Check if theme was saved previously
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim();

            if (username) {
                console.log("Login successful, redirecting...");
                localStorage.setItem('loggedInUser', username);
                // Ensure this filename matches your scanner file exactly
                window.location.href = 'scanner.html'; 
            } else {
                alert("Please enter a username to login.");
            }
        });
    } else {
        console.error("Login button with ID 'login-btn' not found!");
    }
});