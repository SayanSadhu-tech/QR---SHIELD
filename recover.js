document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const recoveryForm = document.getElementById('recovery-form');
    const errorDisplay = document.getElementById('recovery-error');
    const promptDisplay = document.getElementById('recovery-prompt');
    const stepIdentity = document.getElementById('step-identity');
    const stepOtp = document.getElementById('step-otp');
    const stepPassword = document.getElementById('step-password');
    const submitButton = recoveryForm.querySelector('.btn-auth');

    // --- State Variables ---
    let recoveryStep = 1; // 1: Identity, 2: OTP, 3: Password
    let recoveryUser = null; 
    
    // Helper function to generate a simple 6-digit code
    function generateRecoveryCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Helper function to update the visible step
    function updateStepUI() {
        stepIdentity.style.display = 'none';
        stepOtp.style.display = 'none';
        stepPassword.style.display = 'none';

        if (recoveryStep === 1) {
            stepIdentity.style.display = 'block';
            promptDisplay.textContent = 'Enter your registered username and email to verify your identity.';
            submitButton.textContent = 'Verify Identity';
        } else if (recoveryStep === 2) {
            stepOtp.style.display = 'block';
            promptDisplay.textContent = 'A recovery code has been "sent". Enter it below to proceed.';
            submitButton.textContent = 'Verify Code';
        } else if (recoveryStep === 3) {
            stepPassword.style.display = 'block';
            promptDisplay.textContent = 'Set a new password for your account.';
            submitButton.textContent = 'Reset Password';
        }
    }

    // ======================================================
    //                 HANDLE FORM SUBMISSION
    // ======================================================
    recoveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorDisplay.textContent = '';
        const users = JSON.parse(localStorage.getItem('qrScannerUsers')) || [];

        if (recoveryStep === 1) {
            // STEP 1: IDENTITY VERIFICATION
            const username = document.getElementById('rec-username').value.trim();
            const email = document.getElementById('rec-email').value.trim();

            const foundUser = users.find(user => 
                user.username === username && user.email === email
            );

            if (foundUser) {
                const recoveryCode = generateRecoveryCode();
                foundUser.tempRecoveryCode = recoveryCode; 
                sessionStorage.setItem('tempRecoveryUser', JSON.stringify(foundUser));
                
                recoveryUser = foundUser; 
                recoveryStep = 2; 

                alert(`Identity verified! SIMULATED RECOVERY CODE: ${recoveryCode}.`);
                updateStepUI();
                
            } else {
                errorDisplay.textContent = 'Error: Username and Email combination not found.';
            }

        } else if (recoveryStep === 2) {
            // STEP 2: CODE VERIFICATION
            const enteredCode = document.getElementById('rec-otp').value.trim();
            const sessionData = JSON.parse(sessionStorage.getItem('tempRecoveryUser'));

            if (!sessionData || !sessionData.tempRecoveryCode) {
                 errorDisplay.textContent = 'Error: Recovery process expired. Please restart.';
                 recoveryStep = 1;
                 updateStepUI();
                 return;
            }

            if (enteredCode === sessionData.tempRecoveryCode) {
                recoveryStep = 3; 
                updateStepUI();
            } else {
                errorDisplay.textContent = 'Error: Invalid recovery code.';
            }

        } else if (recoveryStep === 3) {
            // STEP 3: PASSWORD RESET
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            if (newPassword !== confirmNewPassword) {
                errorDisplay.textContent = 'Error: New passwords do not match.';
                return;
            }
            if (newPassword.length < 6) {
                errorDisplay.textContent = 'Error: Password must be at least 6 characters long.';
                return;
            }

            const sessionData = JSON.parse(sessionStorage.getItem('tempRecoveryUser'));
            const userIndex = users.findIndex(user => user.username === sessionData.username);

            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('qrScannerUsers', JSON.stringify(users));

                sessionStorage.removeItem('tempRecoveryUser');
                alert('Password reset successful! You can now log in with your new password.');
                window.location.href = 'index.html';
            } else {
                errorDisplay.textContent = 'Error: User not found in database. Please contact support.';
            }
        }
    });
    
    updateStepUI();

    // Theme Setup (Background customization logic removed)
    function themeSetup() {
        const body = document.body;
        const menuToggle = document.getElementById('menu-toggle');
        const dropdown = document.getElementById('theme-controls-dropdown');
        const themeToggle = document.getElementById('theme-toggle');
        
        // Toggle Dropdown Menu
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
        
        // Initial Theme Load
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-theme');
            if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
        } else {
            if (themeToggle) themeToggle.textContent = '🌙 Dark Mode';
        }

        // Theme Switcher Listener
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