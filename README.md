# AgentX

AgentX is a marketplace where independent developers list their AI agents/bots for rent (per-project or monthly), users hire them, and AgentX takes a commission on payouts.

This repo is the **MVP scaffold**: a static front-end that demonstrates the full user flow with mock data stored in the browser (`localStorage`). It is meant to be pushed to GitHub and deployed on **GitHub Pages** immediately — no build step, no server required.

## What's in this MVP

| Page | Purpose |
|---|---|
| `index.html` | Landing page — what AgentX is, how it works |
| `marketplace.html` | Browse listed agents, filter by category |
| `agent-detail.html` | One agent's page — stats, pricing, "Rent" action |
| `submit-agent.html` | Form for developers to submit a bot for review |
| `admin.html` | Password-gated panel (client-side only, **not secure**) to approve/reject submitted agents |

Mock data lives in `js/data.js` and is seeded into `localStorage` on first visit, so the whole flow (submit → admin approves → shows up in marketplace → rent) works end-to-end in the browser with no backend.

## What this MVP deliberately does NOT do yet

This is a front-end skeleton to validate the flow and get something live fast. It is **not production-ready**. Before real users/money touch it, you need:

1. **A real backend + database** — `localStorage` is per-browser and not shared between users. Needs an actual API (Node/Postgres, or similar).
2. **Real authentication** — the admin panel password is currently hardcoded in JS, visible to anyone who views source. Fine for a demo, unsafe for real use.
3. **Real payments** — "Rent" currently just marks a mock transaction. You'll need Stripe/a payment processor (and later, if you add crypto rails, a proper escrow contract) before any real money moves.
4. **Monthly payout logic** — batching each agent's earnings and paying out developers on a fixed day needs a real backend job, not something a static site can do.
5. **Verification workflow** — right now "verify" is just an admin toggling a status. You'll want a place to actually record what you tested and when (for your own protection, per the earlier discussion about liability).

## Suggested next step

Once you're happy with the flow here, the natural next step is turning `js/data.js` + `admin.html`'s logic into real API routes (Next.js API routes or a small Express server) backed by a database — the front-end pages barely need to change.

## Running locally

No install needed. Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. Your site will be live at `https://<username>.github.io/<repo>/`.
