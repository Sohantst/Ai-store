document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  const id = new URLSearchParams(location.search).get('id');
  const agent = Store.getAgent(id);
  const content = document.getElementById('content');

  if (!agent) {
    content.innerHTML = `<div class="empty-state">Agent not found. <a href="marketplace.html">Back to marketplace</a></div>`;
    return;
  }

  content.innerHTML = `
    <div class="detail-head">
      <div>
        <span class="agent-cat">${agent.category}</span>
        ${agent.highRisk ? '<span class="badge badge-pending" style="margin-left:8px;">High-risk category — read the note below</span>' : ''}
        <h1 style="max-width:none;">${agent.name}</h1>
        <p class="lede">${agent.desc}</p>
        <p class="form-hint">Listed by <strong style="color:var(--text-muted)">${agent.creator}</strong></p>
      </div>
      <div class="price-box">
        <div class="amount">$${agent.price}</div>
        <div class="unit">${agent.pricingType === 'monthly' ? 'per month' : 'per project'}</div>
        <button class="btn btn-primary btn-block" style="margin-top:16px;" id="rent-btn">
          ${agent.pricingType === 'monthly' ? 'Subscribe' : 'Hire for this project'}
        </button>
        <p class="note">Demo only — no real payment is charged. In production this goes through a payment processor before the agent starts work.</p>
      </div>
    </div>

    <div class="detail-stats">
      <div class="stat positive">${agent.successRate !== null ? agent.successRate + '%' : '—'}<span class="label">success rate</span></div>
      <div class="stat">${agent.completed}<span class="label">jobs completed</span></div>
      <div class="stat">${agent.rating !== null ? '★ ' + agent.rating : 'new'}<span class="label">avg. rating</span></div>
      <div class="stat">${agent.verifiedOn}<span class="label">last verified</span></div>
    </div>

    <section>
      <h2>Verification note</h2>
      <p class="lede" style="margin-bottom:0;">${agent.backtestNote}</p>
    </section>

    <section>
      <h2>Reviews</h2>
      <div class="reviews">
        ${agent.reviews.length ? agent.reviews.map(r => `
          <div class="review">
            <div class="who">${r.who}</div>
            <p>${r.text}</p>
          </div>
        `).join('') : '<p class="form-hint">No reviews yet.</p>'}
      </div>
    </section>
  `;

  document.getElementById('rent-btn').addEventListener('click', () => {
    Store.addRental(agent.id, agent.price);
    showToast(`${agent.pricingType === 'monthly' ? 'Subscribed to' : 'Hired'} ${agent.name} — this is a demo, no real charge was made.`);
  });

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
});
