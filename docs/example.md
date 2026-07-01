# Example: from renewal signal to owned task

This is an illustrative example of how Renewal Radar by Sighub turns renewal timing that is spread across HubSpot into one clear, owned task. The thresholds below are shown as an illustration, not as fixed product settings.

## The situation in HubSpot

A customer, Acme B.V., has renewal data spread across several HubSpot records:

- a subscription with an end date about 45 days out
- a linked renewal deal still sitting in an early stage
- a company record whose last activity timestamp is about 60 days old

Looked at one record at a time, none of this stands out. Together, it marks a renewal that is approaching with no recent movement and no clear next step.

## What Renewal Radar reads

Renewal Radar reads the metadata that describes this timing:

- the subscription end date
- the renewal deal stage and close date
- the last activity timestamp on the company

It does not read email content, notes, call recordings, or ticket content. It works from the structured fields only.

## The deterministic rule (illustrative)

As an illustration, a rule might be: a renewal is approaching within the next 60 days, the renewal deal is still in an early stage, and there has been no logged activity for 30 or more days. When those conditions all match real data, a renewal risk is raised.

Because the logic is deterministic, the same data always produces the same result, and the result can be explained.

## The task Renewal Radar creates

Renewal Radar creates one HubSpot task for the right owner:

- **Assigned to:** the account or deal owner
- **Due date:** set inside the renewal window
- **Title:** a short, specific summary, for example "Renewal risk: Acme B.V. renews in about 45 days, deal still early, no recent activity"
- **Evidence attached:** the subscription end date, the renewal deal stage, and the last activity date

The owner sees one task, with the reason and the evidence, inside HubSpot where they already work.

## How the task resolves itself

The task is self-resolving. When the underlying signal is gone, it closes automatically. In this example, the task resolves when any of the following happens:

- the renewal deal advances to a later stage
- new activity is logged on the account
- the renewal completes

No one has to remember to close it. This keeps the task list honest and avoids noise.

## Related

- [How it works](./how-it-works.md)
- [HubSpot integration](./hubspot-integration.md)
- [Glossary](./glossary.md)
