# 🛡️ QR SafeScan: Your Shield Against Sneaky QR Threats

## 🚀 The Story Behind SafeScan

Ever scan a QR code and wonder where it's *really* taking you? In a world full of UPIs and quick links, QR codes can be silent threats. **QR SafeScan** was born out of the need for a simple, smart, and secure tool to eliminate that uncertainty.

This project is a commitment to **front-end security best practices**, featuring a comprehensive scanner that doesn't just read data—it *analyzes* it. We've built a user experience that feels solid and professional, complete with a multi-step registration flow that proves we take account integrity seriously.

### What Makes This Scanner Stand Out? (The Features)
* **The Security Engine:** This isn't just a basic reader. It checks every scan against blacklisted domains, flags non-HTTPS links, and warns you about suspicious keywords or direct file downloads (like APKs).
* **"Trust-But-Verify" Registration:** We moved beyond simple passwords. New users go through a simulated **OTP verification** process, mimicking the robust security found in banking apps.
* **The Lifeline (Forgot Password):** Users can recover their accounts through a secure, identity-verified, multi-step process—because we all forget passwords sometimes!
* **Pure Web Power:** Built entirely with HTML, CSS, and vanilla JavaScript, proving that powerful security tools don't need heavy frameworks.
* **Eye-Friendly Interface:** A clean, modern design that includes a persistent **Dark Mode** toggle.

## 🛠️ The Tech Stack (What It's Built With)

| Category | Technology | Why We Chose It |
| :--- | :--- | :--- |
| **Scanning Core** | HTML5-Qrcode | The industry standard for reliable, cross-browser camera access and lightning-fast QR detection. |
| **Foundation** | HTML5, CSS3, JS (ES6+) | Keeps the project fast, lightweight, and focused on fundamental web mastery. |
| **Persistence** | `localStorage` & `sessionStorage` | Handles user sessions, theme preferences, and the temporary data required for our secure verification steps. |
| **The Look** | Custom CSS Variables | Makes Dark Mode toggling instant and scalable with minimal JavaScript logic. |

## 💻 Get It Running (Installation for Developers)

You don't need Docker or a massive server setup to get started!

### Prerequisites

* Node.js and npm (Recommended for running local development tools like Live Server).
* A local development server (VS Code's Live Server is perfect).

### The 3-Step Setup

1.  **Clone the project:** Grab the code from GitHub.
    ```bash
    git clone [YOUR_REPOSITORY_URL_HERE]
    cd qr-safescan
    ```
2.  **Fire up the server:** Open the project folder in your editor and launch `index.html` using a local server extension (like Live Server).
3.  **Go Time:** The application will load in your browser, ready for testing!

## 📝 Your First Steps (How to Use It)

### 1. Account Creation (The Secure Way!)

* Click **"Need to Register?"**.
* Fill out the details. Upon submitting, the system will **simulate a 6-digit OTP**. (Check your browser's alert box or console for this code—it's your key to the next step!)
* Enter the simulated OTP on the **Verification Screen** to activate your account. Success! You're ready to log in.

### 2. Password Rescue Mission

* Click **"Forgot Password?"** on the login screen.
* The system will ask for your registered **Username and Email** for identity confirmation.
* Once confirmed, it generates a **simulated Recovery Code** (again, check the console/alert).
* Verify the code, and you're granted access to set a shiny new password.

### 3. Scanning with Confidence

* Log in to access the main `scanner.html`.
* Point your camera at a QR code (or upload an image).
* **The Magic Happens:** The app doesn't just display the URL; it runs it through our security engine. You get an immediate **SECURE** or **DANGER** verdict, complete with a detailed risk log explaining *why*.

## 💡 Where We Go Next (Future Vision)

This is just the beginning! To make SafeScan truly production-ready, we dream of:

* **Real Server Integration:** Connecting to a Node.js/Python backend to handle genuine OTP delivery via Twilio or SendGrid.
* **A Mobile App:** Wrapping the web code using **Capacitor** to access native camera features for better performance and a smoother user experience.
* **AI-Powered Phishing Detection:** Implementing services that analyze domain age, hosting location, and other factors for advanced threat scoring.

## 🤝 Let's Collaborate!

This project is a labor of love for security and clean code. If you have an idea for a feature, spot a bug, or want to contribute to the analysis engine, please open an issue or send a Pull Request!

Happy Scanning!

## 📄 License

This project is open-source and free to use under the MIT License.
