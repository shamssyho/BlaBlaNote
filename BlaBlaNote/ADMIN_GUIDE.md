# ADMIN_GUIDE.md

This guide explains how administrators operate BlaBlaNote safely and efficiently.

---

## 1. Access the Admin Panel

## Prerequisites
- Your account must have role: `ADMIN`
- You must be logged in

## Steps
1. Log into BlaBlaNote.
2. Open the admin area from navigation.
3. Confirm dashboard widgets are loading.

If access is denied, verify your role in the database/admin user management endpoint.

---

## 2. Manage Users

Typical admin capabilities include:
- View paginated user list
- Search users by email/name
- Filter by status/role/date/activity
- Block/suspend problematic accounts
- Update role (where policy allows)

### Recommended moderation workflow
1. Identify user via support ticket or detection alert.
2. Review account status and recent activity.
3. Apply block/suspension if required.
4. Log reason internally for auditability.
5. Reassess after issue resolution.

---

## 3. Monitor Transcription Jobs

Use admin jobs view to monitor notes in:
- `TRANSCRIBING`
- `SUMMARIZING`
- `FAILED`

### Operational checklist
- Watch failure trends daily.
- Inspect `errorMessage` for repeated patterns.
- Trigger user communication when failures are widespread.
- Escalate provider outages (OpenAI/network) quickly.

### When a job fails repeatedly
- Validate file format support.
- Confirm OpenAI key validity and quota.
- Confirm outbound network connectivity from backend.

---

## 4. View Statistics

Dashboard statistics provide business + operational visibility:
- Total notes
- Total users
- Total share links
- Total failed notes
- Last 7-day trend (notes/users/shares/failures)

Use these indicators to:
- Track product growth
- Detect quality regressions
- Prioritize reliability improvements

---

## 5. Manage Blog

Admin can:
- Create blog posts
- Edit blog posts
- Publish/unpublish posts
- Delete obsolete posts
- Manage categories

### Editorial best practices
- Keep title + excerpt clear and SEO-friendly
- Assign a category for discoverability
- Review grammar and links before publishing
- Use publication checklist for consistency

---

## 6. Handle Errors and Incidents

## 6.1 Common Incident Types
- AI transcription/summarization failures
- Email/WhatsApp delivery failures
- Authentication issues (token refresh/login)
- Database connectivity problems

## 6.2 Incident Response Flow
1. Detect (dashboard, logs, support reports)
2. Classify severity (minor/major/critical)
3. Mitigate quickly (rollback, disable feature, failover)
4. Communicate status to stakeholders/users
5. Resolve root cause
6. Publish postmortem and preventive actions

## 6.3 Minimum Incident Data to Collect
- Timestamp and environment
- Endpoint/module involved
- User impact scope
- Error message/signature
- Temporary mitigation applied

---

## 7. Security Best Practices for Admins

- Enforce strong admin passwords
- Use unique admin accounts (no shared credentials)
- Revoke admin access immediately when staff changes occur
- Review suspicious sign-ins regularly
- Avoid exposing API keys in logs or screenshots
- Rotate high-risk secrets periodically

---

## 8. Operational Best Practices

- Review dashboard daily
- Track top recurring failures weekly
- Validate backups and restore procedures monthly
- Keep dependencies and runtime patched
- Audit role assignments quarterly
- Maintain staging environment parity with production

---

## 9. Data Governance & Compliance Tasks

Admins should ensure:
- User export and deletion requests are handled in SLA
- Public links are revocable and expiration policies are respected
- Retention and purge policies are applied
- Access to personal data is limited by least privilege

---

## 10. Admin Runbook Quick Commands (Technical)

```bash
# Start API
yarn nx serve api

# Start frontend
yarn nx serve front

# Apply Prisma migrations
yarn prisma:migrate

# Production migration deployment
npx prisma migrate deploy

# Build all apps
yarn build

# Open API docs
# http://localhost:3001/api/docs
```

---

## 11. Escalation Guidelines

Escalate immediately when:
- Authentication is broadly failing
- AI processing failure rate spikes significantly
- Database is unreachable
- Data integrity is at risk
- Any potential security breach is suspected

Maintain an on-call contact list and decision matrix for severity levels.
