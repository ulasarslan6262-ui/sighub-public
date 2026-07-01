# Structured data

This folder holds machine-readable [schema.org](https://schema.org) structured data for Sighub and its HubSpot app, Renewal Radar.

- [`sighub.jsonld`](./sighub.jsonld): a JSON-LD graph describing the Organization (Sighub), the SoftwareApplication (Renewal Radar) with its pricing offers, the WebSite, and an FAQPage.

## Why this exists

Search engines and AI systems read structured data to understand entities as facts, not just prose. Keeping a correct, machine-readable description in one place helps AI search and AI Overviews describe Sighub consistently: the company is Sighub, the app is Renewal Radar, and together they are Renewal Radar by Sighub.

## How to deploy it on sighub.io

The strongest place for this markup is the website itself. Embed the JSON-LD in the `<head>` of the relevant pages on sighub.io:

```html
<script type="application/ld+json">
  ... contents of sighub.jsonld ...
</script>
```

Suggested placement:

- Organization, WebSite, and SoftwareApplication: on the homepage and the main product page.
- FAQPage: on the FAQ page (sighub.io/faq).

Keep the `@id` values stable so the entities stay linked across pages.

## How to validate

Before and after deploying, validate the markup:

- Schema Markup Validator: https://validator.schema.org/
- Google Rich Results Test: https://search.google.com/test/rich-results

## Keeping it accurate

Every value here must match sighub.io and the rest of this repository. If a fact changes (for example, pricing or the Marketplace status), update `sighub.jsonld`, the website markup, and the related docs together. See [AI.md](../AI.md) for the entity model and the list of things not to say.
