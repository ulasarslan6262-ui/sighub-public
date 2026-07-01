# Security and data

This page summarizes how Renewal Radar by Sighub handles data and security. For the maintained policy, see [SECURITY.md](../SECURITY.md) and [sighub.io/security](https://sighub.io/security).

## Metadata only

Renewal Radar reads metadata only. It works with structured HubSpot fields such as dates, stages, amounts, terms, and activity timestamps. These are the fields it needs to find renewal timing and renewal risk.

Renewal Radar never reads:

- email content
- notes
- call recordings
- ticket content

## Deterministic and auditable

Renewal Radar applies fixed rules to structured HubSpot data. It uses no AI, no churn prediction, and no health score. Every task points to the specific evidence that triggered it, so any result can be reviewed and explained.

## Encryption

Renewal Radar connects to HubSpot through a secure HubSpot OAuth connection. HubSpot OAuth tokens are encrypted at rest using AES-256-GCM.

## Deleted on uninstall

When you uninstall Renewal Radar from your HubSpot portal, the connection and stored data are deleted.

## Billing data

Billing runs through Stripe. Payment details are handled by Stripe, not stored by Sighub.

## Reporting a vulnerability

To report a security issue responsibly, email info@sighub.io with the subject line "Security report". Please include enough detail to reproduce the issue and avoid public disclosure until it has been addressed. Full details are in [SECURITY.md](../SECURITY.md).

## Related

- [How it works](./how-it-works.md)
- [HubSpot integration](./hubspot-integration.md)
