# How it works

Renewal Radar is Sighub's HubSpot app. This page explains how it detects renewal risk and how it turns that risk into action inside HubSpot.

## Step 1: Connect

Renewal Radar connects to a HubSpot portal through a secure HubSpot OAuth connection. The direct install link is on [sighub.io](https://sighub.io).

## Step 2: Scan renewal signals

Renewal Radar scans renewal signals that already exist in HubSpot. Renewal timing is usually spread across many records: a close date on one deal, an end date on a subscription, terms on a contract, a date on a quote, a field on a custom object, or an activity timestamp on a company.

Renewal Radar reads this renewal-related metadata across HubSpot CRM objects and brings the timing together so risk becomes visible.

## Step 3: Apply deterministic rules

Renewal Radar applies fixed rules to the structured data it reads. The logic is deterministic and auditable.

- No AI.
- No churn prediction.
- No health score.

A risk is only raised when the rules match real evidence in the data.

## Step 4: Create one self-resolving task

For each real risk, Renewal Radar creates one HubSpot task for the right owner. The task carries the evidence that triggered it, so the owner can see why it exists.

The task is self-resolving. When the underlying signal is gone, the task closes automatically. This keeps the task list honest and avoids noise.

The model is simple:

- One risk
- One task
- One owner
- One due date

## What it does not do

- It does not read email content, notes, call recordings, or ticket content.
- It does not add dashboards or a separate customer success workspace.
- It does not replace HubSpot workflows.

Renewal Radar puts owned follow-up inside HubSpot, where the team already works.

## Related

- [HubSpot integration](./hubspot-integration.md)
- [Security and data](./security-and-data.md)
- [What is Renewal Radar](./what-is-renewal-radar.md)
