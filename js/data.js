/*
  AgentX mock data layer.
  Everything lives in localStorage under the "agentx_*" keys so the whole
  flow (submit -> admin approve -> marketplace -> rent) works in-browser
  with no backend. Replace this file's functions with real API calls
  when you add a backend — the page code that calls Store.* shouldn't
  need to change much.
*/

const Store = (() => {
  const KEYS = {
    agents: 'agentx_agents',
    submissions: 'agentx_submissions',
    rentals: 'agentx_rentals',
  };

  const SEED_AGENTS = [
    {
      id: 'a1',
      name: 'Vega SEO Agent',
      category: 'Marketing',
      desc: 'Audits a site and rewrites on-page SEO — titles, meta, headings — with a report of what changed and why.',
      creator: 'dev_amara',
      pricingType: 'per-project',
      price: 25,
      successRate: 96,
      completed: 341,
      rating: 4.8,
      verifiedOn: '2026-08-02',
      backtestNote: 'Ran against 12 sample sites; output reviewed manually before listing.',
      reviews: [
        { who: 'client_ray', text: 'Delivered a full audit in under 10 minutes, caught issues our last freelancer missed.' },
        { who: 'shopnix_store', text: 'Good first pass, needed light editing before publishing — still saved hours.' },
      ],
    },
    {
      id: 'a2',
      name: 'Ledger Research Agent',
      category: 'Research',
      desc: 'Pulls public filings and market data into a structured research brief on a company or sector.',
      creator: 'quantforge',
      pricingType: 'monthly',
      price: 40,
      successRate: 91,
      completed: 128,
      rating: 4.5,
      verifiedOn: '2026-09-10',
      backtestNote: 'Cross-checked 20 briefs against source filings for factual accuracy.',
      reviews: [
        { who: 'analyst_priya', text: 'Solid starting point for sector overviews, I still verify numbers myself.' },
      ],
    },
    {
      id: 'a3',
      name: 'Nightly Build Agent',
      category: 'Coding',
      desc: 'Reviews open pull requests overnight, flags likely bugs, and leaves inline comments.',
      creator: 'devtools_co',
      pricingType: 'monthly',
      price: 60,
      successRate: 89,
      completed: 512,
      rating: 4.6,
      verifiedOn: '2026-07-19',
      backtestNote: 'Tested on 3 open-source repos for two weeks before listing.',
      reviews: [
        { who: 'maintainer_lee', text: 'Catches the boring stuff reliably, misses architectural issues (expected).' },
        { who: 'oss_team_x', text: 'Cut our review time noticeably for small PRs.' },
      ],
    },
    {
      id: 'a4',
      name: 'Wanderline Travel Agent',
      category: 'Travel',
      desc: 'Builds a day-by-day itinerary from a budget, dates, and a few preferences.',
      creator: 'triplab',
      pricingType: 'per-project',
      price: 8,
      successRate: 94,
      completed: 903,
      rating: 4.7,
      verifiedOn: '2026-08-28',
      backtestNote: 'Spot-checked 15 itineraries for realistic timing and open hours.',
      reviews: [
        { who: 'nadia_k', text: 'Itinerary was realistic, times between stops actually made sense.' },
      ],
    },
    {
      id: 'a5',
      name: 'Ticker Watch Agent',
      category: 'Trading',
      desc: 'Monitors a watchlist and sends alerts on threshold breaks. Does not place trades.',
      creator: 'quantforge',
      pricingType: 'monthly',
      price: 35,
      successRate: 85,
      completed: 76,
      rating: 4.1,
      verifiedOn: '2026-09-20',
      backtestNote: 'High-risk category — alerts only, no execution. Reviewed alert accuracy over 30 days of paper data.',
      reviews: [
        { who: 'trader_omar', text: 'Alerts are timely, occasional false positive on illiquid tickers.' },
      ],
      highRisk: true,
    },
  ];

  function seedIfEmpty() {
    if (!localStorage.getItem(KEYS.agents)) {
      localStorage.setItem(KEYS.agents, JSON.stringify(SEED_AGENTS));
    }
    if (!localStorage.getItem(KEYS.submissions)) {
      localStorage.setItem(KEYS.submissions, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.rentals)) {
      localStorage.setItem(KEYS.rentals, JSON.stringify([]));
    }
  }

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  return {
    init: seedIfEmpty,

    getAgents() { return read(KEYS.agents); },
    getAgent(id) { return read(KEYS.agents).find(a => a.id === id) || null; },

    getSubmissions() { return read(KEYS.submissions); },
    addSubmission(sub) {
      const subs = read(KEYS.submissions);
      sub.id = 'sub_' + Date.now();
      sub.status = 'pending';
      sub.submittedOn = new Date().toISOString().slice(0, 10);
      subs.unshift(sub);
      write(KEYS.submissions, subs);
      return sub;
    },
    updateSubmissionStatus(id, status) {
      const subs = read(KEYS.submissions);
      const sub = subs.find(s => s.id === id);
      if (!sub) return null;
      sub.status = status;
      write(KEYS.submissions, subs);

      if (status === 'approved') {
        const agents = read(KEYS.agents);
        agents.unshift({
          id: 'a_' + Date.now(),
          name: sub.name,
          category: sub.category,
          desc: sub.desc,
          creator: sub.creator,
          pricingType: sub.pricingType,
          price: Number(sub.price),
          successRate: null,
          completed: 0,
          rating: null,
          verifiedOn: new Date().toISOString().slice(0, 10),
          backtestNote: sub.backtestNote || 'Awaiting first verification notes.',
          reviews: [],
        });
        write(KEYS.agents, agents);
      }
      return sub;
    },

    addRental(agentId, amount) {
      const rentals = read(KEYS.rentals);
      rentals.unshift({ agentId, amount, date: new Date().toISOString() });
      write(KEYS.rentals, rentals);
    },
  };
})();

document.addEventListener('DOMContentLoaded', () => Store.init());
