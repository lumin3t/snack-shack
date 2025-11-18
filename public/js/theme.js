// public/js/theme.js
// VULNERABILITY: DOM-based XSS Sink (Simulated)
// This file demonstrates where the theme cookie value (which is rendered unsafely 
// in the header) could be used and exploited on the client side.

document.addEventListener('DOMContentLoaded', () => {
    // Attempt to read the theme value from the custom script tag in the header.
    // In a real DOM XSS, this might read from the URL fragment or localStorage.
    
    const themeInjector = document.getElementById('theme-cookie-injector');
    if (themeInjector) {
        // In a real attack, a payload in the cookie could be reflected here
        // and used in a DOM manipulation function like innerHTML or document.write.
        const themeValue = themeInjector.innerHTML.match(/theme value from cookie: (.+)/)?.[1];
        
        if (themeValue) {
            console.log(`[Theme Script] Successfully retrieved theme value from header: ${themeValue}`);
            
            // Example of an unsafe DOM operation that *would* trigger DOM XSS
            // if themeValue contained a payload:
            // document.body.innerHTML += themeValue; 
            
            // For the CSS theme switch, the vulnerability is in the `<link>` tag 
            // of the EJS header, but this JS shows the client-side mechanism.
        }
    }

    // Add theme switching UI helpers if needed (omitted for simplicity, relying on direct cookie edit)
});