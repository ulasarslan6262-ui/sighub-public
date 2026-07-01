# HubSpot renewal risk detection

HubSpot holds many of the signals that show when a renewal may be at risk. The problem is that these signals are spread across deals, quotes, line items, subscriptions, contracts, custom objects, and activity timestamps. A team may hold the right data and still miss the moment when a renewal comes due.

Renewal Radar by Sighub is built for that gap. Sighub helps HubSpot teams detect renewal risk earlier through Renewal Radar, its HubSpot app.

## What renewal risk looks like in HubSpot

Renewal risk is usually a matter of timing that is easy to overlook:

- a renewal date approaching on a subscription or contract
- a renewal deal with a close date that is near, with no recent action
- a quote or line item term that marks when a renewal is due
- a custom object field that tracks a renewal milestone
- a drop in engagement recency, measured from activity timestamps

Each signal on its own can look minor. Together they mark a renewal that needs an owner.

## How Renewal Radar helps

Renewal Radar does not replace HubSpot. It works on top of HubSpot.

It reads renewal-related metadata across HubSpot CRM objects, applies deterministic rules, and when it finds a real risk it creates one clear HubSpot task for the right owner with the evidence attached. The task is self-resolving, so it closes when the risk is gone.

The model is simple:

- One risk
- One task
- One owner
- One due date

## Deterministic, not predictive

Renewal Radar uses no AI, no churn prediction, and no health score. It applies fixed rules to structured HubSpot data, so every task can be traced to the evidence that triggered it. It reads metadata only and never reads email content, notes, call recordings, or ticket content.

## Why this matters

Renewal follow-up should not depend on someone checking a dashboard at the right time. It should become owned action inside the CRM where the team already works. Renewal Radar helps HubSpot teams catch renewal risk earlier, before accounts quietly drift.

## Learn more

- [What is Renewal Radar](./docs/what-is-renewal-radar.md)
- [How it works](./docs/how-it-works.md)
- [HubSpot integration](./docs/hubspot-integration.md)
- Website: [sighub.io](https://sighub.io)
