document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  const agents = Store.getAgents();
  const categories = ['All', ...new Set(agents.map(a => a.category))];
  let active = 'All';

  const filtersEl = document.getElementById('filters');
  const listEl = document.getElementById('agent-list');
  const countEl = document.getElementById('count-label');

  function renderFilters() {
    filtersEl.innerHTML = categories.map(c =>
      `<button class="filter-chip ${c === active ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
    filtersEl.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        active = btn.dataset.cat;
        renderFilters();
        renderList();
      });
    });
  }

  function renderList() {
    const filtered = active === 'All' ? agents : agents.filter(a => a.category === active);
    countEl.textContent = `${filtered.length} agent${filtered.length === 1 ? '' : 's'} listed`;

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No agents in this category yet.</div>`;
      return;
    }

    listEl.innerHTML = filtered.map(a => `
      <a class="agent-row" href="agent-detail.html?id=${a.id}">
        <div class="agent-main">
          <span class="agent-cat">${a.category}</span>
          <div class="agent-name">${a.name}</div>
          <div class="agent-desc">${a.desc}</div>
        </div>
        <div class="stat ${a.successRate !== null ? 'positive' : ''}">
          ${a.successRate !== null ? a.successRate + '%' : '—'}
          <span class="label">success rate</span>
        </div>
        <div class="stat">
          ${a.rating !== null ? '★ ' + a.rating : 'new'}
          <span class="label">${a.completed} completed</span>
        </div>
        <div class="stat">
          $${a.price}<span class="label">${a.pricingType === 'monthly' ? '/ month' : '/ project'}</span>
        </div>
      </a>
    `).join('');
  }

  renderFilters();
  renderList();
});
