document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('u-name').textContent = localStorage.getItem('loggedInUser') || "User";
    const scanner = new Html5Qrcode("qr-reader");
    let isFlashOn = false;

    document.getElementById('flash-toggle').onclick = () => {
        isFlashOn = !isFlashOn;
        scanner.applyVideoConstraints({ advanced: [{ torch: isFlashOn }] });
    };

    document.getElementById('file-input').onchange = (e) => {
        if (e.target.files.length > 0) {
            scanner.scanFile(e.target.files[0], true).then(onScanSuccess).catch(() => alert("No QR found"));
        }
    };

    function onScanSuccess(decodedText) {
        let risk = 0;
        let logs = [];
        let bank = "Standard Content";

        if (decodedText.includes("upi://")) {
            bank = "Payment Link";
            if (decodedText.includes("okicici")) bank = "ICICI Bank";
            if (decodedText.includes("oksbi")) bank = "SBI Bank";
        } 
        
        if (decodedText.startsWith("http")) {
            risk += 30; logs.push("External link detected");
            if (decodedText.includes("bit.ly") || decodedText.includes("tiny")) {
                risk += 40; logs.push("High Risk: URL Shortener detected");
            }
        }

        sessionStorage.setItem('scanResult', JSON.stringify({
            data: decodedText,
            stealth: Math.max(0, 100 - risk),
            logs: logs,
            bank: bank
        }));
        window.location.href = 'result.html';
    }

    scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, onScanSuccess);
});