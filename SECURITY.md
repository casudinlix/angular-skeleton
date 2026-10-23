# Security policy

This is a reusable frontend skeleton, not a hardened identity service. Report vulnerabilities privately using GitHub's Security Advisories feature on this repository. Do not disclose secrets or private security details in public issues.

## Before deploying
- Replace the sample /api contract with a production server that validates sessions, CSRF, tenant isolation and resource-level permissions.
- Use HTTPS; configure HttpOnly, Secure, SameSite session cookies and XSRF-TOKEN cookie/header validation with your backend.
- Serve client assets with appropriate CSP and security headers, and enable auditing of dependencies.
- Never store access tokens or private secrets in localStorage, translation JSON or public assets.
- Configure server fallback for client routes without rewriting /api errors to index.html.
- Test all error paths, rate limits, expiry, and cross-tenant denial before launch.
