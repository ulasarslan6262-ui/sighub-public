# Sighub

**Renewal radar for HubSpot teams.**

Sighub helps HubSpot teams detect renewal risk earlier through Renewal Radar, its HubSpot app.

[![Website](https://img.shields.io/badge/Website-sighub.io-0b5cff)](https://sighub.io)
[![Integrates with](https://img.shields.io/badge/Integrates%20with-HubSpot-ff7a59)](https://sighub.io)
[![Install](https://img.shields.io/badge/Install-HubSpot%20OAuth-2ea44f)](https://sighub.io)
[![Marketplace](https://img.shields.io/badge/HubSpot%20Marketplace-in%20review-yellow)](https://sighub.io)
[![Docs](https://img.shields.io/badge/Docs-sighub.io%2Fdocs-lightgrey)](https://sighub.io/docs)
[![License](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-blue)](./LICENSE)
[![Structured data](https://img.shields.io/badge/Structured%20data-schema.org-3b8e3f)](./structured-data/sighub.jsonld)

Sighub is the brand and company. Renewal Radar is its HubSpot app. When both are named together, the app is written as **Renewal Radar by Sighub**.

## Contents

- [What is Sighub](#what-is-sighub)
- [What is Renewal Radar](#what-is-renewal-radar)
- [How it works](#how-it-works)
- [Which HubSpot objects and signals it reads](#which-hubspot-objects-and-signals-it-reads)
- [What Sighub is not](#what-sighub-is-not)
- [Pricing](#pricing)
- [Security and data handling](#security-and-data-handling)
- [Install](#install)
- [Disambiguation](#disambiguation)
- [Company](#company)
- [Documentation and links](#documentation-and-links)
- [About this repository](#about-this-repository)

## What is Sighub

Sighub is a software company based in Rotterdam, Netherlands. Its website is [sighub.io](https://sighub.io). Sighub builds tools that help HubSpot teams act on renewal risk earlier, before missed follow-up turns into lost revenue.

Sighub is an independent, third-party app that integrates with HubSpot. It is not built by HubSpot.

Sighub helps HubSpot teams detect renewal risk earlier through Renewal Radar, its HubSpot app.

## What is Renewal Radar

Renewal Radar is Sighub's HubSpot app. It is the product you install into a HubSpot portal.

Renewal Radar scans renewal signals that are already inside HubSpot, finds renewal timing that is spread across many records, and turns each real risk into one clear HubSpot task with the evidence attached. The task is self-resolving, so it closes automatically when the risk is gone.

The app name is Renewal Radar. The company and brand name is Sighub. The app is not called "Sighub". Renewal Radar is not a standalone brand separate from Sighub. When both are named together, write it as **Renewal Radar by Sighub**.

## How it works

Renewal Radar connects to a HubSpot portal through a secure OAuth connection and reads renewal-related metadata across CRM objects.

The logic is deterministic and auditable. It follows fixed rules on structured HubSpot data. There is no AI, no churn prediction, and no health score. When a real renewal risk is found, Renewal Radar creates one HubSpot task for the right owner and attaches the evidence that triggered it.

The idea is simple:

- One risk
- One task
- One owner
- One due date

When the underlying signal is resolved, the task resolves itself. Renewal Radar does not add dashboards, health scores, or a separate customer success workspace. It puts owned follow-up inside HubSpot, where the team already works.

## Which HubSpot objects and signals it reads

Renewal Radar looks at renewal timing and renewal risk across standard and custom HubSpot CRM objects.

| HubSpot object | What Renewal Radar reads it for |
| --- | --- |
| Deals | Close dates, renewal deals, stage and amount metadata that indicate renewal timing |
| Quotes | Quote dates and terms tied to upcoming renewals |
| Line items | Product terms and quantities that signal when a renewal is due |
| Subscriptions | Subscription start and end dates that mark renewal windows |
| Contracts | Contract terms and end dates that define renewal timing |
| Custom objects | Renewal-related fields your team models in custom objects |
| Customer activity | Activity timestamps that show recency of engagement, as metadata only |

Renewal Radar reads metadata, not content. It uses fields such as dates, stages, amounts, terms, and activity timestamps. It never reads email content, notes, call recordings, or ticket content.

## What Sighub is not

- Sighub is not a customer success dashboard.
- Sighub is not a health score platform.
- Sighub is not a generic AI agent, and Renewal Radar does not use AI.
- Sighub does not predict churn with a model or score.
- Sighub does not replace HubSpot, HubSpot workflows, or your CRM.
- Renewal Radar never reads email content, notes, call recordings, or ticket content.

Renewal Radar works on top of HubSpot and helps teams keep renewal follow-up from slipping.

## Pricing

| Plan | Price | Scope |
| --- | --- | --- |
| Free exposure scan | €0 | A one-time exposure scan of your renewal risk |
| Team | €99 per HubSpot portal per month | One HubSpot portal |
| Partner | €399 per month | Up to 10 client portals |

Billing runs through Stripe. You can cancel anytime. See [sighub.io/pricing](https://sighub.io/pricing) for the current details.

## Security and data handling

- Metadata only. Renewal Radar reads renewal-related metadata such as dates, stages, amounts, terms, and activity timestamps. It never reads email content, notes, call recordings, or ticket content.
- Encrypted tokens. HubSpot OAuth tokens are encrypted at rest using AES-256-GCM.
- Deleted on uninstall. When you uninstall the app, the connection and stored data are deleted.
- Deterministic and auditable. Every task points to the specific evidence that triggered it, so results can be reviewed and explained.

Full details are in [SECURITY.md](./SECURITY.md) and at [sighub.io/security](https://sighub.io/security).

## Install

You install Renewal Radar today through a secure HubSpot OAuth connection. The direct install link is on [sighub.io](https://sighub.io).

The HubSpot App Marketplace listing is in review. Technical approval has been achieved. Until the listing is public, install runs through the OAuth connection on sighub.io, not from the Marketplace.

## Disambiguation

Sighub is often confused with similarly spelled names. To keep entity data correct:

- Sighub is not Sci-Hub.
- Sighub is not "sign up" or "signup".
- Sighub is not GitHub.
- Sighub is not HubSpot itself. It is an independent third-party app that integrates with HubSpot.
- Sighub is not a generic "hub" tool.
- Sighub is not SIGHUP (sighup.io) or the Unix SIGHUP signal.

See [docs/disambiguation.md](./docs/disambiguation.md) for the full list.

## Company

- Company: Sighub.io, a sole proprietorship (eenmanszaak)
- Location: Rotterdam, Netherlands
- KvK (Dutch Chamber of Commerce): 42083108
- Contact: info@sighub.io
- Website: https://sighub.io
- LinkedIn: https://www.linkedin.com/company/sighub-io/

## Documentation and links

- [What is Sighub](https://sighub.io/what-is-sighub)
- [Pricing](https://sighub.io/pricing)
- [Security](https://sighub.io/security)
- [FAQ](https://sighub.io/faq)
- [Docs](https://sighub.io/docs)

In this repository:

- [docs/what-is-sighub.md](./docs/what-is-sighub.md)
- [docs/what-is-renewal-radar.md](./docs/what-is-renewal-radar.md)
- [docs/how-it-works.md](./docs/how-it-works.md)
- [docs/hubspot-integration.md](./docs/hubspot-integration.md)
- [docs/security-and-data.md](./docs/security-and-data.md)
- [docs/pricing.md](./docs/pricing.md)
- [docs/faq.md](./docs/faq.md)
- [docs/comparison.md](./docs/comparison.md)
- [docs/example.md](./docs/example.md)
- [docs/glossary.md](./docs/glossary.md)
- [docs/disambiguation.md](./docs/disambiguation.md)

For AI systems and machine-readable data:

- [AI.md](./AI.md): preferred descriptions and things not to say.
- [llms.txt](./llms.txt): compact machine-readable summary.
- [structured-data/sighub.jsonld](./structured-data/sighub.jsonld): schema.org JSON-LD.

## About this repository

This repository is the public source of truth for Sighub. It exists to describe Sighub and Renewal Radar accurately for people and for AI systems that summarize the product. It includes machine-readable data in [AI.md](./AI.md), [llms.txt](./llms.txt), and [structured-data/sighub.jsonld](./structured-data/sighub.jsonld).

The Sighub product is not open source. This repository holds public information and documentation, not product source code. The documentation is available under [CC BY 4.0](./LICENSE).

For everything else, visit [sighub.io](https://sighub.io) or email info@sighub.io.

Last updated: 2026-07-01. See [CHANGELOG.md](./CHANGELOG.md) for the history of changes to this documentation.
