/* Demo-only gate. This password is visible to anyone who views source —
   fine for showing the flow, not a real access control. Swap for real
   backend auth before any real submissions touch this. */
const DEMO_PASSWORD = 'agentx-admin';

document.addEventListener('DOMContentLoaded', () => {
  Store.init();

  const gate = document.getElementById('gate');
  const panel = document.getElementById('panel');
  const pwInput = document.getElementById('pw');

  document.getElementById('unlock-btn').addEventListener('click', unlock);
  pwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') unlock(); });

  function unlock() {
    if (pwInput.value === DEMO_PASSWORD) {
      gate.style.display = 'none';
      panel.style.display = 'block';
      renderSubmissions();
    } else {
      pwInput.style.borderColor = 'var(--negative)';
    }
  }

  function renderSubmissions() {
    const subs = Store.getSubmissions();
    const listEl = document.getElementById('submissions-list');

    if (subs.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No submissions yet. Try submitting one from "List your agent".</div>`;
      return;
    }

    listEl.innerHTML = subs.map(s => `
      <div class="admin-row">
        <div>
          <span class="agent-cat">${s.category}</span>
          <div class="agent-name">${s.name} <span class="form-hint">by ${s.creator}</span></div>
          <div class="agent-desc" style="white-space:normal;">${s.desc}</div>
          <div class="form-hint">Access: ${s.access} · Submitted ${s.submittedOn}</div>
        </div>
        <div class="stat">$${s.price}<span class="label">${s.pricingType === 'monthly' ? '/ month' : '/ project'}</span></div>
        <div><span class="badge badge-${s.status}">${s.status}</span></div>
        <div class="admin-actions">
          ${s.status === 'pending' ? `
            <button class="btn btn-primary" data-action="approve" data-id="${s.id}">Approve</button>
            <button class="btn" data-action="reject" data-id="${s.id}">Reject</button>
          ` : ''}
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.action === 'approve' ? 'approved' : 'rejected';
        Store.updateSubmissionStatus(btn.dataset.id, status);
        renderSubmissions();
      });
    });
  }
});
