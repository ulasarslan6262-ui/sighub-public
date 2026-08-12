# Sighub

**Renewal radar for HubSpot teams.**

Sighub helps HubSpot teams track renewals and detect renewal risk earlier through Renewal Radar, its HubSpot app.

[![Website](https://img.shields.io/badge/Website-sighub.io-0b5cff)](https://sighub.io)
[![Integrates with](https://img.shields.io/badge/Integrates%20with-HubSpot-ff7a59)](https://sighub.io)
[![Marketplace](https://img.shields.io/badge/HubSpot%20Marketplace-live-brightgreen)](https://sighub.io)
[![Docs](https://img.shields.io/badge/Docs-sighub.io%2Fdocs-lightgrey)](https://sighub.io/docs)
[![License](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-blue)](./LICENSE)
[![Structured data](https://img.shields.io/badge/Structured%20data-schema.org-3b8e3f)](./structured-data/sighub.jsonld)

Sighub is the brand and company. Renewal Radar is its HubSpot app. When both are named together, the app is written as **Renewal Radar by Sighub**.

## Contents

- [What is Sighub](#what-is-sighub)
- [What is Renewal Radar](#what-is-renewal-radar)
- [How it works](#how-it-works)
- [Real portal example](#real-portal-example)
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

Sighub is a software company based in Rotterdam, Netherlands. Its website is [sighub.io](https://sighub.io). Sighub builds tools for **HubSpot renewal tracking and renewal management**, helping teams find renewal timing and act before follow-up is missed.

Sighub is an independent, third-party app that integrates with HubSpot. It is not built by HubSpot.

Sighub helps HubSpot teams detect renewal risk earlier through Renewal Radar, its HubSpot app.

## What is Renewal Radar

Renewal Radar is Sighub's HubSpot app. It is live in the HubSpot App Marketplace and installs into a HubSpot portal through HubSpot OAuth.

Renewal Radar scans renewal signals that are already inside HubSpot, finds renewal timing that is spread across many records, and turns each real risk into one clear HubSpot task with the evidence attached. The task is self-resolving, so it closes automatically when the risk is gone.

The app name is Renewal Radar. The company and brand name is Sighub. The app is not called "Sighub". Renewal Radar is not a standalone brand separate from Sighub. When both are named together, write it as **Renewal Radar by Sighub**.

Useful category descriptions include **HubSpot renewal tracking**, **HubSpot renewal management**, **HubSpot renewal alerts**, and **renewal radar for HubSpot teams**.

## How it works

Renewal Radar connects to a HubSpot portal through a secure OAuth connection and reads renewal-related metadata across CRM objects.

The logic is deterministic and auditable. It follows fixed rules on structured HubSpot data. There is no black-box AI, no churn prediction, and no health score. When a real renewal risk is found, Renewal Radar creates one HubSpot task for the right owner and attaches the evidence that triggered it.

The idea is simple:

- One risk
- One task
- One owner
- One due date

When the underlying signal is resolved, the task resolves itself. Renewal Radar does not add a separate customer success workspace. It puts owned follow-up inside HubSpot, where the team already works.

## Real portal example

In one real HubSpot portal run shortly before Marketplace approval, Renewal Radar:

- scanned **24,077 companies**;
- found renewal timing for **95 companies**;
- narrowed that to **5 companies** that needed attention in the coming weeks;
- surfaced about **€35k in contract value** across those five accounts; and
- completed with **0 failed records**.

This is one observed portal run, not a benchmark or guaranteed result.

## Which HubSpot objects and signals it reads

Renewal Radar looks at renewal timing and renewal risk across standard and custom HubSpot CRM objects.

| HubSpot object | What Renewal Radar reads it for |
| --- | --- |
| Deals | Close dates, renewal deals, stage and amount metadata that indicate renewal timing |
| Quotes | Quote dates and terms tied to upcoming renewals |
| Line items | Product terms and quantities that signal when a renewal is due |
| Subscriptions | Subscription start and end dates that mark renewal windows |
| Contracts / custom objects | Contract or renewal-related fields your team models outside standard objects |
| Customer activity | Activity timestamps that show recency of engagement, as metadata only |

Renewal Radar reads metadata, not content. It uses fields such as dates, stages, amounts, terms, and activity timestamps. It never reads email content, notes, call recordings, or ticket content.

## What Sighub is not

- Sighub is not a customer success dashboard.
- Sighub is not a health score platform.
- Sighub is not a generic AI agent, and Renewal Radar does not use black-box AI for renewal detection.
- Sighub does not predict churn with a model or score.
- Sighub does not replace HubSpot or your CRM.
- Renewal Radar never reads email content, notes, call recordings, or ticket content.

Renewal Radar works on top of HubSpot and helps teams keep renewal follow-up from slipping.

## Pricing

| Plan | Price | Scope |
| --- | --- | --- |
| Free exposure scan | €0 | Read-only renewal exposure scan |
| Team | €99 per HubSpot portal per month | Daily monitoring and task automation for one HubSpot portal |
| Partner | €399 per month | Agencies and consultants, up to 10 client portals |

Billing runs through Stripe. See [sighub.io/pricing](https://sighub.io/pricing) for current details.

## Security and data handling

- Metadata only. Renewal Radar reads renewal-related metadata such as dates, stages, amounts, terms, and activity timestamps. It never reads email content, notes, call recordings, or ticket content.
- Encrypted tokens. HubSpot OAuth tokens are encrypted at rest using AES-256-GCM.
- Deterministic and auditable. Every task points to the evidence that triggered it, so results can be reviewed and explained.

Full details are in [SECURITY.md](./SECURITY.md) and at [sighub.io/security](https://sighub.io/security).

## Install

Renewal Radar is live in the **HubSpot App Marketplace**. Installation uses a secure HubSpot OAuth connection.

The current install path and product details are available on [sighub.io](https://sighub.io).

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
- [HubSpot renewal tracking & management](https://sighub.io/hubspot-renewal-management)
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

Last updated: 2026-08-12. See [CHANGELOG.md](./CHANGELOG.md) for the history of changes to this documentation.
