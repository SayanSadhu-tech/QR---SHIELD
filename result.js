document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('scan-result-display');
    const userDisplay = document.getElementById('username-display');
    
    // Set user info
    const user = localStorage.getItem('loggedInUser') || "Guest";
    if(userDisplay) userDisplay.textContent = user;

    // Get scan data
    const data = JSON.parse(sessionStorage.getItem('scanResult'));

    if (!data) {
        display.innerHTML = "<p style='text-align:center; padding:20px;'>❌ No scan data found. Please scan again.</p>";
        return;
    }

    const { analysis, scannedData } = data;
    const color = (analysis.verdict === "SAFE") ? "#2ecc71" : "#e74c3c";

    // Build Bank Section safely
    let bankHtml = "";
    if (analysis.upiInfo) {
        bankHtml = `
            <div style="background: rgba(52, 152, 219, 0.1); padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #3498db; text-align: left;">
                <p style="margin: 0; font-weight: bold; color: #3498db;">🏦 Bank Details</p>
                <p style="margin: 5px 0 0 0;"><strong>Bank:</strong> ${analysis.upiInfo.bank}</p>
                <p style="margin: 2px 0 0 0;"><strong>Payee:</strong> ${analysis.upiInfo.payee}</p>
            </div>`;
    }

    // Inject content
    display.innerHTML = `
        <h2 style="color: ${color}; margin-bottom: 20px; text-align: center;">Verdict: ${analysis.verdict}</h2>
        ${bankHtml}
        <div style="text-align: left; font-size: 0.95rem;">
            <strong>Security Log:</strong>
            <p style="margin-top: 5px; color: ${analysis.reasons?.length > 0 ? '#e74c3c' : '#2ecc71'}">
                ${analysis.reasons?.join(", ") || "No malicious patterns detected."}
            </p>
        </div>
        <div style="margin-top: 25px; font-size: 0.75rem; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; color: #666; word-break: break-all; text-align: left;">
            <strong>Raw Content:</strong><br>${scannedData}
        </div>
    `;
});