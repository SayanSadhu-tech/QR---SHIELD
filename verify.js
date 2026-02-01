document.addEventListener('DOMContentLoaded', () => {
    const tempUserString = sessionStorage.getItem('tempRegistrationUser');
    const verificationForm = document.getElementById('verification-form');
    const errorDisplay = document.getElementById('verification-error');
    
    // --- Security Check: Ensure a user is waiting for verification ---
    if (!tempUserString) {
        alert('No pending registration found. Please register first.');
        window.location.href = 'register.html';
        return;
    }
    
    const tempUser = JSON.parse(tempUserString);
    
    // ======================================================
    //                 HANDLE OTP VERIFICATION
    // ======================================================
    if (verificationForm) {
        verificationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDisplay.textContent = '';
            
            const enteredOtp = document.getElementById('otp-code').value.trim();

            if (enteredOtp === tempUser.otp) {
                // --- SUCCESS: Verification Passed! ---
                
                // 1. Load existing permanent users
                const users = JSON.parse(localStorage.getItem('qrScannerUsers')) || [];
                
                // 2. Create the final user object (exclude the temporary OTP)
                const finalUser = {
                    fullName: tempUser.fullName,
                    email: tempUser.email,
                    phone: tempUser.phone,
                    username: tempUser.username,
                    password: tempUser.password
                };
                
                // 3. Add the new, verified user
                users.push(finalUser);
                localStorage.setItem('qrScannerUsers', JSON.stringify(users));
                
                // 4. Clean up temporary storage
                sessionStorage.removeItem('tempRegistrationUser');
                
                alert('Verification successful! Your account is now active. Please log in.');
                window.location.href = 'index.html';

            } else {
                errorDisplay.textContent = 'Error: Invalid OTP. Please try again.';
            }
        });
    }

    // Theme Setup (Removed background image logic)
    function themeSetup() {
        const body = document.body;
        const menuToggle = document.getElementById('menu-toggle');
        const dropdown = document.getElementById('theme-controls-dropdown');
        const themeToggle = document.getElementById('theme-toggle');
        
        // Handle Kebab Menu Toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                dropdown.classList.toggle('show');
            });
            document.addEventListener('click', (event) => {
                if (!menuToggle.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
        
        // Apply saved theme on load
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-theme');
            if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
        } else {
            if (themeToggle) themeToggle.textContent = '🌙 Dark Mode';
        }

        // Handle Theme Switching
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (body.classList.toggle('dark-theme')) {
                    localStorage.setItem('theme', 'dark');
                    themeToggle.textContent = '☀️ Light Mode';
                } else {
                    localStorage.setItem('theme', 'light');
                    themeToggle.textContent = '🌙 Dark Mode';
                }
                dropdown.classList.remove('show');
            });
        }
    }

    themeSetup();
});