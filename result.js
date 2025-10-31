document.addEventListener('DOMContentLoaded', () => {
    // --- 1. AUTHENTICATION AND LOGOUT ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return; 
    }
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = loggedInUser;
    }
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }

    // --- 2. DISPLAY SCAN RESULT (MODIFIED FOR DETAILED ANALYSIS) ---
    const resultDisplay = document.getElementById('scan-result-display');
    const container = document.getElementById('result-container');
    const storedResultString = sessionStorage.getItem('scanResult');

    if (storedResultString && resultDisplay && container) {
        try {
            // Parse the detailed analysis object
            const { scannedData, analysis } = JSON.parse(storedResultString);
            
            // Set colors and header based on safety status
            let statusColor = analysis.isSafe ? '#10b981' : '#ef4444'; // Green or Red
            let statusText = analysis.isSafe ? 'SECURE' : 'DANGER';
            
            container.style.backgroundColor = analysis.isSafe ? '#ecfdf5' : '#fee2e2';
            container.style.borderColor = statusColor;
            container.style.borderWidth = '2px';
            container.style.borderStyle = 'solid';

            // Build the HTML output
            let htmlOutput = `
                <h2 style="color: ${statusColor}; margin-bottom: 10px;">
                    SCAN STATUS: ${statusText}
                </h2>
                <p><strong>QR Code Type:</strong> ${analysis.type}</p>
                <p><strong>Security Message:</strong> ${analysis.message}</p>
                <hr style="margin: 15px 0; border-top: 1px solid #ddd;">
            `;

            // Prominently display the URL or data
            if (scannedData.toLowerCase().startsWith('http')) {
                // Display as a clickable URL block
                htmlOutput += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background-color: #f8f9fa;">
                        <p style="font-weight: bold; margin-bottom: 5px;">Scanned URL Link:</p>
                        <a href="${scannedData}" target="_blank" style="word-break: break-all;">
                            ${scannedData}
                        </a>
                    </div>
                `;
            } else {
                // Display as raw data block
                htmlOutput += `
                    <p style="font-weight: bold; margin-bottom: 5px;">Raw Scanned Data:</p>
                    <div style="background: #f1f5f9; padding: 10px; border-radius: 4px; word-wrap: break-word; font-family: monospace;">
                        ${scannedData}
                    </div>
                `;
            }
            
            // Detailed Analysis Log (if risks were found)
            if (analysis.analysisLog && analysis.analysisLog.length > 0) {
                htmlOutput += `
                    <p style="font-weight: bold; color: #b91c1c; margin-top: 15px;">Detailed Risk Log:</p>
                    <ul style="list-style-type: disc; margin-left: 20px; padding-left: 0;">
                        ${analysis.analysisLog.map(log => `<li style="color: #b91c1c;">${log}</li>`).join('')}
                    </ul>
                `;
            }

            resultDisplay.innerHTML = htmlOutput;

        } catch (e) {
            // Fallback for corrupted data
            resultDisplay.textContent = 'Error parsing scan data. The data may be corrupted.';
            console.error("Error parsing stored scanResult:", e);
        }
    } else {
        resultDisplay.textContent = 'No scan result found. Please go back and scan a code.';
    }

    // --- 3. "SCAN AGAIN" BUTTON ---
    const scanAgainButton = document.getElementById('scan-again-button');
    if (scanAgainButton) {
        scanAgainButton.addEventListener('click', () => {
            window.location.href = 'scanner.html';
        });
    }
});