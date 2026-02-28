# Admin Guide

## Access

- Admin routes require authenticated user with `ADMIN` role.
- Use the admin dashboard for user and operational management.

## User Administration

- List and filter users by role, status, block state and search terms.
- Block/unblock users when policy violations occur.
- Review account lifecycle fields and activity metadata.

## Content Governance

- Manage blog categories and blog posts.
- Control post publication status.
- Monitor public-facing content quality.

## Operational Workflows

- Review job and processing indicators from admin endpoints.
- Verify note pipeline outcomes for failed processing cases.
- Track share activity and integration reliability.

## Security Controls

- Rotate JWT secrets using secure deployment process.
- Restrict service keys for Brevo, Twilio, Notion and S3.
- Enforce HTTPS and secure cookie policies in production.

## Documentation and API

- Swagger UI: `/api/docs`
- OpenAPI artifacts: `docs/api/openapi.json`, `docs/api/openapi.yaml`
- Architecture diagrams: `docs/architecture/ARCHITECTURE_DIAGRAMS.md`
