### Snack Shack - Vulnerable Workshop Demo

This is an intentionally vulnerable web application built with Node.js/Express and vanilla HTML/CSS/EJS, designed solely for educational purposes, particularly for cybersecurity workshops.

### 🚨 Vulnerabilities Implemented (For Educational Purposes)

SQL Injection (Login): Login page is vulnerable to authentication bypass using ' OR 1=1 -- .
Insecure Direct Object Reference (IDOR):
Account View: /account?id=X allows viewing any user's profile.
Points View: /points?id=X allows viewing any user's loyalty points.
Client-Controlled Price: The purchase route trusts the price sent from the client-side form.
Stored Cross-Site Scripting (XSS): The feedback page stores un-sanitized comments, which execute on the /admin/feedback page.
DOM-based XSS: The theme cookie value is unsafely embedded in the client-side environment.
Hardcoded Secret Path: A secret menu path is revealed in robots.txt.

Use this application only in controlled, safe, and legal testing environments.