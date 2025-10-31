document.addEventListener('DOMContentLoaded', () => {
    // --- PART 1: AUTHENTICATION PROTECTION & LOGOUT (KEEP THIS) ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return; 
    }
    document.getElementById('username-display').textContent = loggedInUser;
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html'; 
    });

    // --- PART 2: QR CODE SECURITY ANALYSIS (NEW JAVASCRIPT LOGIC) ---
    
    // Equivalent of Python's constants
    const AUTHORIZED_DATA = [
        "ayangoswami820@okicici", "upi://pay", "@okicici",
        "phonepe", "gpay", "paytm"
    ];
    const BLACKLIST_DOMAINS = [
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "shorturl.at",
        "apkcombo.com", "apkpure.com", "apk-dl.com", "mediafire.com",
        "mega.nz", "zippyshare.com"
    ];

    // Helper: Checks if data contains any authorized keywords
    const isAuthorized = (data) => {
        const dataLower = data.toLowerCase();
        return AUTHORIZED_DATA.some(auth => dataLower.includes(auth));
    };

    // Helper: Analyzes the URL for malicious indicators
    const analyzeUrl = (url) => {
        const info = [];
        const parsedUrl = new URL(url);
        const domain = parsedUrl.hostname.toLowerCase();

        // 1️⃣ APK file detection
        if (url.toLowerCase().endsWith(".apk")) {
            info.push("⚠️ Malicious: Direct APK file link — may install malware.");
        }

        // 2️⃣ Blacklist domain check
        if (BLACKLIST_DOMAINS.some(bad => domain.includes(bad))) {
            info.push(`🚫 Malicious: Blacklisted domain '${domain}'.`);
        }

        // 3️⃣ Non-HTTPS warning
        if (parsedUrl.protocol !== "https:") {
            info.push("⚠️ Malicious: Not a secure HTTPS link — could be unsafe.");
        }
        
        // Note: URL expansion is complex in JS and is removed for simplification/security.

        return info;
    };
    
    // --- PART 3: QR SCANNER SETUP AND HANDLERS (MODIFIED) ---

    const fileSelector = document.getElementById('file-selector');
    const qrCodeRegionId = "qr-reader";
    let html5QrCode;
    let isFlashOn = false;

    // Configuration for the scanner
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        // Try back camera first
        supportedScanTypes: [
            // Use camera when available
            Html5QrcodeSupportedFormats.QR_CODE
        ],
        aspectRatio: 1.0 
    };

    // Main Analysis and Success Handler
    const onScanSuccess = (decodedText, decodedResult) => {
        // Stop the camera once a successful scan is made
        if (html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                console.log("Scanner successfully stopped.");
            }).catch(err => {
                console.error("Error stopping scanner:", err);
            });
        }
        
        // --- Perform the full analysis here ---
        const analysisResult = {
            isSafe: true,
            type: "Text/Other",
            message: "Data processed successfully.",
            analysisLog: []
        };

        if (decodedText.toLowerCase().startsWith("http")) {
            analysisResult.type = "URL";
            const maliciousReasons = analyzeUrl(decodedText);
            analysisResult.analysisLog.push(...maliciousReasons);
            
            if (maliciousReasons.length > 0) {
                analysisResult.isSafe = false;
                analysisResult.message = "⚠️ URL flagged with potential risks!";
            } else {
                 analysisResult.message = "✅ URL appears safe based on blacklist/protocol checks.";
            }

        } else if (decodedText.toLowerCase().startsWith("upi://pay")) {
            analysisResult.type = "UPI Payment";
        }
        
        // Authorization Check
        if (!isAuthorized(decodedText)) {
            analysisResult.isSafe = false;
            analysisResult.message = "❌ WARNING: Unauthorized QR source!";
            analysisResult.analysisLog.push("Unauthorized QR data detected based on keywords.");
        }


        // Save the detailed analysis object to session storage
        sessionStorage.setItem('scanResult', JSON.stringify({
            scannedData: decodedText,
            analysis: analysisResult
        }));
        
        // Redirect to the result page
        window.location.href = 'result.html';
    };

    const onScanFailure = (error) => {
        // console.warn(`Code scan error = ${error}`);
    };

    function startScanner() {
        html5QrCode = new Html5Qrcode(qrCodeRegionId); 
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .then(() => {
                console.log("Camera started successfully.");
            })
            .catch(err => {
                console.error("Unable to start scanning. Check permissions or Live Server status.", err);
                document.getElementById(qrCodeRegionId).innerHTML = "<p style='color:red;'>Camera access failed. Ensure you are using Live Server and have granted camera permissions.</p>";
            });
    }

    // --- Handle File Upload (Modified to call onScanSuccess) ---
    fileSelector.addEventListener('change', event => {
        if (event.target.files.length === 0) return;
        
        // Stop the camera before processing the file
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop();
        }

        html5QrCode.scanFile(event.target.files[0], true)
            .then(decodedText => {
                // Call the main success handler to run the security analysis and redirect
                onScanSuccess(decodedText); 
            })
            .catch(err => {
                console.error(err);
                alert(`Error scanning file. Ensure the image is a clear QR code.`);
            });
    });

    // --- Handle Flashlight Toggle ---
    const flashToggleButton = document.getElementById('flash-toggle');
    flashToggleButton.addEventListener('click', () => {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.getRunningTrack().then(track => {
                if (track) {
                    isFlashOn = !isFlashOn;
                    track.applyConstraints({
                        advanced: [{ torch: isFlashOn }]
                    }).catch(err => {
                        console.error("Failed to toggle flash.", err);
                    });
                }
            }).catch(err => {
                console.error("Failed to get running track.", err);
            });
        }
    });

    startScanner();
});