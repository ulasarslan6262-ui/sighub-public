# Security

This document describes how Sighub and its HubSpot app, Renewal Radar, handle data and security. For the current public summary, see [sighub.io/security](https://sighub.io/security).

## Data access model

Renewal Radar reads metadata only. It works with structured HubSpot fields such as dates, stages, amounts, terms, and activity timestamps. These are the fields it needs to find renewal timing and renewal risk.

Renewal Radar never reads:

- email content
- notes
- call recordings
- ticket content

If a signal cannot be derived from renewal-related metadata, Renewal Radar does not use it.

## Deterministic and auditable

Renewal Radar is deterministic. It applies fixed rules to structured HubSpot data. It does not use AI, churn prediction, or health scores. Every task it creates points to the specific evidence that triggered it, so any result can be reviewed and explained.

## Authentication and tokens

Renewal Radar connects to HubSpot through a secure HubSpot OAuth connection. HubSpot OAuth tokens are encrypted at rest using AES-256-GCM.

## Data deletion

When you uninstall Renewal Radar from your HubSpot portal, the connection and stored data are deleted.

## Billing

Billing runs through Stripe. Payment details are handled by Stripe, not stored by Sighub.

## Reporting a vulnerability

If you believe you have found a security vulnerability in Sighub or Renewal Radar, please report it responsibly.

- Email: info@sighub.io
- Subject line: Security report

Please include enough detail to reproduce the issue, such as the affected area, the steps you took, and what you observed. Please do not publicly disclose the issue until it has been addressed.

We aim to acknowledge valid reports and work toward a fix. We ask that you avoid privacy violations, data destruction, and any disruption to other users while investigating.

## Scope

This policy covers the Sighub app Renewal Radar and the sighub.io website. It does not cover HubSpot itself. HubSpot is a separate company and platform. Renewal Radar is an independent third-party app that integrates with HubSpot.
