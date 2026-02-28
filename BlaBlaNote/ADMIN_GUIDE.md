# ADMIN_GUIDE.md

This guide explains how to operate BlaBlaNote as an administrator.

---

## 1. Admin access

- Your account must have role `ADMIN`.
- Sign in and open the admin dashboard.
- Confirm widgets load (stats, jobs, users).

If access fails, verify your role assignment.

---

## 2. User management

### What you can do
- View users with pagination.
- Search/filter users.
- Block or unblock users.
- Review account status and activity indicators.

### Recommended workflow
1. Identify user from support ticket/alert.
2. Review account details and risk context.
3. Apply block if needed.
4. Document reason internally.
5. Reassess later if temporary action.

---

## 3. Monitor transcription jobs

Use the jobs panel to track notes in states:
- `TRANSCRIBING`
- `SUMMARIZING`
- `FAILED`

### Daily checks
- Check current failure count.
- Review repeating error patterns.
- Identify provider-related incidents quickly.

---

## 4. Handle failed jobs

When failures increase:
1. Confirm API and database health.
2. Verify AI provider credentials and quota.
3. Check storage/network connectivity.
4. Communicate impact to support/product.
5. Track mitigation and recovery metrics.

For single-user failures, validate file quality/format and advise retry.

---

## 5. View statistics

Use `/admin/stats` data to monitor:
- User growth.
- Notes volume.
- Share activity.
- Failure trends.

Review trends weekly to detect regressions early.

---

## 6. Manage blog

### Operations
- Create and edit blog posts.
- Publish/unpublish content.
- Delete outdated posts.
- Manage categories.

### Editorial checklist
- Clear title and excerpt.
- Correct category.
- Links and formatting verified.
- Final review before publish.

---

## 7. Security best practices

- Use unique admin accounts (no shared login).
- Enforce strong passwords and periodic rotation.
- Remove admin rights immediately when staff changes.
- Avoid exposing secrets in logs/screenshots.
- Review unusual sign-in patterns.
- Apply least-privilege principles.

---

## 8. Recommended operational workflow

### Start of day
1. Check dashboard KPIs.
2. Review failed jobs and new incidents.
3. Check user abuse/moderation queue.

### During day
1. Resolve high-severity issues first.
2. Coordinate with support on impacted users.
3. Track incident timeline and updates.

### End of day
1. Confirm incident status.
2. Capture unresolved risks.
3. Prepare handoff notes.

---

## 9. Incident response runbook

### Severity levels
- **Low**: isolated issue, minor impact.
- **Medium**: multiple users impacted.
- **High/Critical**: core flows unavailable or security risk.

### Response steps
1. Detect and validate incident.
2. Classify severity.
3. Mitigate quickly.
4. Communicate status.
5. Resolve root cause.
6. Document post-incident actions.

---

## 10. Compliance operations

- Support user data export requests.
- Support account deletion requests.
- Ensure share link expiration/revocation policy is respected.
- Keep admin access and actions aligned with governance policy.

---

## 11. Useful commands

```bash
# Start API
yarn nx serve api

# Start frontend
yarn nx serve front

# Apply migrations
yarn prisma:migrate

# Production migrations
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

# Run tests
yarn test:all
```
