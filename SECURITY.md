# Security & Privacy Policy — CelebMate AI

CelebMate AI is committed to safe, responsible, and privacy-preserving generative AI application development. This document outlines our core security architecture, threat model mitigations, and data protection practices.

---

## 1. Zero PII & Local Data Isolation

CelebMate AI operates on a **client-first, zero-telemetry** architecture:
- **No Remote Database**: User celebration plans, guest headcounts, budgets, and private chat inquiries are stored strictly inside the user's browser `localStorage` and `sessionStorage`.
- **Zero Third-Party Tracking**: No analytics trackers, marketing cookies, or tracking pixels are included in this application.
- **Immediate Data Wipe**: Users can remove their API keys and reset all stored plan data with one click in the Settings dialog.

---

## 2. Bring Your Own Key (BYOK) Architecture

- **No Hardcoded Credentials**: The repository contains zero hardcoded API keys, tokens, or confidential endpoints.
- **Client-Direct Transport**: The Google Gemini API key provided by the user is stored in local browser memory and transmitted **only** to official Google API servers (`https://generativelanguage.googleapis.com`) via HTTPS POST requests.
- **Offline Fallback**: CelebMate AI includes an intelligent offline simulation engine. Evaluators and users can test all features (budget allocations, timelines, invitations, themes) without providing a live Gemini API key.

---

## 3. Cross-Site Scripting (XSS) Prevention

All dynamic user-supplied inputs and AI outputs are strictly sanitized prior to DOM insertion:
- **`textContent` Priority**: Dynamic text rendering relies on `textContent` and `createElement()` rather than `innerHTML` wherever possible.
- **HTML Character Escaping**: Where formatting is required, inputs are filtered through `escapeHtml()` in `js/utils/sanitizer.js`, escaping `&`, `<`, `>`, `"`, `'`, `/`, and `` ` ``.
- **Tag Stripping**: `stripHtml()` and `sanitizeChatMessage()` remove injected script tags or malicious event attributes before prompt dispatch.

---

## 4. Recommended Content Security Policy (CSP)

For production hosting on GitHub Pages, the following CSP header directive is recommended:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data:;
```

---

## 5. Reporting Vulnerabilities

If you discover any security vulnerabilities or concerns in CelebMate AI, please report them via a GitHub Issue or contact the project maintainer directly.
