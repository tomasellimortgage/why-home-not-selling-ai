
# Why Isn't My Home Selling – AI Listing Analyzer

Deploy this app using GitHub + Vercel.

## Setup

1. Upload this project to GitHub.
2. Import repository into Vercel.
3. Add environment variables:

OPENAI_API_KEY=yourkey
OPENAI_MODEL=gpt-5.4
LEAD_WEBHOOK_URL=yourZapierWebhook

4. Deploy.

## What It Does

Seller pastes their listing URL.

AI generates a diagnostic report:
- price vs comps
- listing quality
- buyer obstacles
- days on market signals

Then captures the lead and sends it to your webhook.
