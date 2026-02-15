# Security Checklist - Mulligan Resident App

## Critical Security Requirements

### ✅ Completed

#### Authentication & Session Management
- [x] Secure cookie-based sessions (iron-session)
- [x] HttpOnly cookies (prevents XSS access)
- [x] SameSite=lax (CSRF protection)
- [x] 7-day session expiration
- [x] Password hashing with bcrypt (10 rounds)
- [x] Force password change on first login
- [x] Role-based access control (RBAC)
- [x] Session validation on all protected routes

#### Data Protection
- [x] No PHI storage (architecture-level compliance)
- [x] Minimal data collection principle
- [x] User passwords never stored in plaintext
- [x] Session secrets in environment variables

#### Input Validation
- [x] Form validation on client and server
- [x] SQL injection protection (Prisma ORM)
- [x] XSS protection (React escaping)

---

## 🚧 To Implement

### High Priority

#### File Upload Security
- [ ] File type validation (image/* only)
- [ ] File size limits (max 10MB)
- [ ] Filename sanitization (prevent path traversal)
- [ ] Virus scanning (production)
- [ ] Separate upload directory outside public root
- [ ] No executable file uploads
- [ ] Content-Type verification
- [ ] Image dimension validation

#### Rate Limiting
- [ ] Login endpoint: 5 attempts per 15 minutes per IP
- [ ] Password change: 3 attempts per hour per user
- [ ] File upload: 10 uploads per hour per user
- [ ] Message sending: 50 messages per day per user
- [ ] API endpoints: 100 requests per minute per user

#### Audit Logging
- [ ] Log all authentication attempts (success/failure)
- [ ] Log password changes
- [ ] Log user creation/deactivation
- [ ] Log announcement creation/deletion
- [ ] Log chore approvals/rejections
- [ ] Log messaging status changes
- [ ] Include actor ID, timestamp, action, target

### Medium Priority

#### Password Policy Enforcement
- [ ] Minimum 8 characters (currently enforced)
- [ ] Require at least one uppercase letter
- [ ] Require at least one lowercase letter
- [ ] Require at least one number
- [ ] Require at least one special character
- [ ] Prevent common passwords (dictionary check)
- [ ] Password history (prevent reuse of last 3)
- [ ] Password expiration (90 days for staff/admin)

#### Session Security Enhancements
- [ ] Session timeout on inactivity (30 minutes)
- [ ] Concurrent session limits (1 session per user)
- [ ] Device fingerprinting
- [ ] Logout on password change
- [ ] Remember me functionality (optional, secure)

#### API Security
- [ ] Request size limits (1MB for JSON, 10MB for files)
- [ ] CORS configuration (whitelist only trusted origins)
- [ ] API versioning
- [ ] Request ID tracking
- [ ] Response headers (X-Frame-Options, CSP, etc.)

### Lower Priority

#### Advanced Security
- [ ] Two-factor authentication (2FA) for admin
- [ ] Account lockout after failed attempts
- [ ] IP whitelist for admin access (optional)
- [ ] Security headers (Helmet.js)
- [ ] Subresource Integrity (SRI) for CDN assets
- [ ] Content Security Policy (CSP)

---

## Production Deployment Checklist

### Environment Configuration
- [ ] Change SESSION_SECRET to cryptographically secure random string (min 32 chars)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/TLS (mandatory)
- [ ] Use strong database password
- [ ] Disable database public access
- [ ] Configure secure CORS policy
- [ ] Remove development/debug endpoints
- [ ] Disable error stack traces in responses

### Database Security
- [ ] Enable PostgreSQL SSL connections
- [ ] Use connection pooling (PgBouncer)
- [ ] Implement read-only database user for reporting
- [ ] Regular automated backups (daily minimum)
- [ ] Backup encryption at rest
- [ ] Test backup restoration procedure
- [ ] Database access logging
- [ ] Limit database user permissions (principle of least privilege)

### Infrastructure Security
- [ ] Web Application Firewall (WAF)
- [ ] DDoS protection (Cloudflare, AWS Shield)
- [ ] Regular security patching
- [ ] Intrusion detection system
- [ ] Log aggregation and monitoring
- [ ] Alert on suspicious activity
- [ ] Encrypted connections (TLS 1.3+)
- [ ] Security incident response plan

### File Storage (Production)
- [ ] Migrate to S3 or equivalent
- [ ] Enable S3 bucket versioning
- [ ] Implement S3 bucket policies (private by default)
- [ ] Use signed URLs for file access
- [ ] Enable server-side encryption
- [ ] Regular file system audits
- [ ] Implement file retention policies
- [ ] Automated cleanup of expired files

### Monitoring & Logging
- [ ] Centralized logging (Datadog, Splunk, ELK)
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Uptime monitoring
- [ ] Performance monitoring (APM)
- [ ] Security event monitoring
- [ ] Alert on failed login attempts
- [ ] Alert on privilege escalation attempts
- [ ] Regular log review

---

## Compliance Considerations

### Non-PHI Compliance
- [x] No medical data collected
- [x] No diagnoses stored
- [x] No treatment notes
- [x] No medication information
- [x] No clinical charting
- [ ] Privacy policy for non-PHI data
- [ ] Terms of service
- [ ] Data retention policy documentation

### Data Minimization
- [x] Only collect necessary data
- [ ] Regular data cleanup
- [ ] User data export capability
- [ ] User data deletion capability (right to be forgotten)

### Access Control
- [x] Role-based access (Resident, Staff, Admin)
- [x] Residents see only their own data
- [x] Staff see only necessary resident data
- [ ] Audit all data access
- [ ] Regular access review

---

## Testing Requirements

### Security Testing
- [ ] OWASP Top 10 vulnerability scan
- [ ] Penetration testing (before production)
- [ ] Dependency vulnerability scanning (npm audit)
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Authentication bypass testing
- [ ] Authorization bypass testing
- [ ] File upload attack testing
- [ ] Session hijacking testing

### Performance Testing
- [ ] Load testing (target: 100 concurrent users)
- [ ] Stress testing
- [ ] File upload performance
- [ ] Database query optimization
- [ ] API response time testing

---

## Incident Response Plan

### Preparation
- [ ] Document security contacts
- [ ] Define incident severity levels
- [ ] Create escalation procedures
- [ ] Set up communication channels
- [ ] Prepare incident response runbook

### Detection
- [ ] Monitor security logs
- [ ] Set up automated alerts
- [ ] Regular security audits
- [ ] User reporting mechanism

### Response
- [ ] Isolate affected systems
- [ ] Preserve evidence
- [ ] Notify stakeholders
- [ ] Implement fixes
- [ ] Document incident
- [ ] Post-mortem analysis

---

## Regular Security Maintenance

### Daily
- [ ] Monitor error logs
- [ ] Check security alerts
- [ ] Review failed login attempts

### Weekly
- [ ] Review audit logs
- [ ] Check for dependency updates
- [ ] Monitor system performance

### Monthly
- [ ] Security patch updates
- [ ] Access review (remove inactive users)
- [ ] Backup restoration test
- [ ] Review and rotate secrets

### Quarterly
- [ ] Security audit
- [ ] Penetration testing
- [ ] Policy review and updates
- [ ] Security training for staff

### Annually
- [ ] Comprehensive security review
- [ ] Third-party security assessment
- [ ] Disaster recovery drill
- [ ] Update incident response plan

---

## Current Risk Assessment

### Low Risk ✅
- Password storage (bcrypt hashing)
- SQL injection (Prisma ORM)
- XSS (React auto-escaping)
- Session fixation (session regeneration)

### Medium Risk ⚠️
- Rate limiting not implemented
- File upload validation incomplete
- No 2FA for admin accounts
- Session timeout not implemented

### High Risk ⚠️⚠️
- Production deployment without HTTPS
- Default SESSION_SECRET in production
- No audit logging implementation
- File storage security (local filesystem)

---

## Notes

This is a living document. Update after:
- Security incidents
- Major code changes
- Dependency updates
- Compliance requirement changes
- Penetration test findings

**Last Updated**: February 15, 2026  
**Next Review**: March 15, 2026
