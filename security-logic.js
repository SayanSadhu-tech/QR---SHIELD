// =============================
// AUTHORIZED & BLACKLIST DATA
// =============================
const AUTHORIZED_DATA = [
    "ayangoswami820@okicici", "upi://pay", "@okicici", "phonepe", "gpay", "paytm",
    "wikipedia.org", "google.com", "youtube.com", "github.com", "linkedin.com",
    "amazon.in", "amazon.com", "flipkart.com", "whatsapp.com", "instagram.com", "facebook.com"
];

const BLACKLIST_DOMAINS = [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "shorturl.at",
    "apkcombo.com", "apkpure.com", "apk-dl.com", "mediafire.com",
    "mega.nz", "zippyshare.com"
];

const SHORTENERS = new Set(["bit.ly", "t.co", "tinyurl.com", "goo.gl", "lnkd.in"]);

const BRAND_DOMAINS = {
    "GOOGLE PAY": ["google.com", "gpay.google.com", "goo.gl"],
    "PHONEPE": ["phonepe.com"],
    "PAYTM": ["paytm.com", "ptyes"],
    "SBI": ["sbi.co.in"]
};

const UPI_HANDLES = {
    "okicici": "ICICI Bank", "oksbi": "State Bank of India", "okaxis": "Axis Bank",
    "okhdfcbank": "HDFC Bank", "okpaytm": "Paytm Payments Bank", "okpnb": "PNB"
    // Add other handles from your Python list here...
};

// =============================
// CORE LOGIC FUNCTIONS
// =============================

// Levinshtein Distance (Fuzzy Match replacement for Python's difflib)
function getSimiliarity(s1, s2) {
    let longer = s1.length < s2.length ? s2 : s1;
    let shorter = s1.length < s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    const editDistance = (a, b) => {
        const costs = [];
        for (let i = 0; i <= a.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= b.length; j++) {
                if (i === 0) costs[j] = j;
                else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (a.charAt(i - 1) !== b.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[b.length] = lastValue;
        }
        return costs[b.length];
    };
    return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function analyzeQRData(data) {
    const d = data.toLowerCase();
    let type = "TEXT QR";
    let score = 0;
    let reasons = [];
    let upiDetails = null;

    // 1. Determine Type
    if (d.startsWith("upi://")) type = "UPI PAYMENT QR";
    else if (d.startsWith("http")) type = "WEB LINK QR";

    // 2. URL/Domain Analysis
    if (d.startsWith("http") || d.startsWith("upi://")) {
        try {
            const urlObj = new URL(d.startsWith("upi://") ? d.replace("upi://", "http://") : d);
            const domain = urlObj.hostname;

            if (BLACKLIST_DOMAINS.includes(domain)) { score += 80; reasons.push("Blacklisted domain"); }
            if (SHORTENERS.has(domain)) { score += 30; reasons.push("URL shortener used"); }
            if (domain.match(/\d+\.\d+\.\d+\.\d+/)) { score += 40; reasons.push("IP-based URL"); }

            // Typo/Brand Impersonation Check
            for (let [brand, legits] of Object.entries(BRAND_DOMAINS)) {
                legits.forEach(ld => {
                    let ratio = getSimiliarity(domain, ld);
                    if (ratio > 0.7 && ratio < 1.0) {
                        score += 30;
                        reasons.push(`Possible typo for ${brand} (${ld})`);
                    }
                });
            }
        } catch (e) { reasons.push("Invalid URL structure"); }
    }

    // 3. UPI Parsing
    if (d.startsWith("upi://")) {
        const params = new URLSearchParams(data.split('?')[1]);
        const pa = params.get('pa') || "";
        let bank = "Unknown Bank";
        for (let handle in UPI_HANDLES) {
            if (pa.includes(handle)) bank = UPI_HANDLES[handle];
        }
        upiDetails = {
            payee: params.get('pn') || "Unknown",
            upiId: pa,
            bank: bank,
            amount: params.get('am') || "Any"
        };
    }

    // 4. Final Verdict
    let verdict = "SAFE";
    if (score >= 60) verdict = "DANGEROUS";
    else if (score >= 30) verdict = "SUSPICIOUS";

    return { type, verdict, score, reasons, upiDetails };
}