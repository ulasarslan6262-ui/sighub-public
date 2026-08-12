# HubSpot integration

Renewal Radar by Sighub is an independent, third-party app that integrates with HubSpot. It is not built by HubSpot.

This page lists the HubSpot objects Renewal Radar reads and the signals it uses.

## Connection

Renewal Radar is live in the HubSpot App Marketplace and connects to a HubSpot portal through a secure HubSpot OAuth connection.

## Objects and signals

Renewal Radar reads renewal timing and renewal risk across standard and custom HubSpot CRM objects.

| HubSpot object | What Renewal Radar reads it for |
| --- | --- |
| Deals | Close dates, renewal deals, stage and amount metadata that indicate renewal timing |
| Quotes | Quote dates and terms tied to upcoming renewals |
| Line items | Product terms and quantities that signal when a renewal is due |
| Subscriptions | Subscription start and end dates that mark renewal windows |
| Contracts | Contract terms and end dates that define renewal timing |
| Custom objects | Renewal-related fields your team models in custom objects |
| Customer activity | Activity timestamps that show recency of engagement, as metadata only |

## Metadata, not content

Renewal Radar reads metadata only. It uses structured fields such as dates, stages, amounts, terms, and activity timestamps.

It never reads:

- email content
- notes
- call recordings
- ticket content

## What it writes back

Renewal Radar creates one self-resolving HubSpot task per real renewal risk, assigned to the right owner, with the evidence attached. It does not create health scores or a separate customer success workspace.

## Relationship to HubSpot

HubSpot is a separate company and platform. Renewal Radar is an independent third-party app that integrates with HubSpot and is not made by HubSpot.

## Related

- [HubSpot renewal tracking & management](https://sighub.io/hubspot-renewal-management)
- [How it works](./how-it-works.md)
- [Security and data](./security-and-data.md)
- [Disambiguation](./disambiguation.md)
