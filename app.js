'use strict';

// ── DEFAULT SUBSCRIPTIONS ──
const DEFAULT_SUBS = [
  { id: 1, name: 'YouTube Premium', amount: 21,  day: 1,  color: '#ff4d4d', url: 'https://youtube.com/paid_memberships',       emoji: 'YT' },
  { id: 2, name: 'Gemini',          amount: 20,  day: 28, color: '#4d9eff', url: 'https://one.google.com/about/plans',         emoji: 'G' },
  { id: 3, name: 'iCloud+',         amount: 3,   day: 23, color: '#a8a8b3', url: 'https://appleid.apple.com',                  emoji: '☁' },
  { id: 4, name: 'Car Wash',        amount: 22,  day: 15, color: '#2ecc8a', url: '',                                           emoji: '🚗' },
  { id: 5, name: 'Jetsu Anime',     amount: 2,   day: 1,  color: '#ff7c4d', url: 'https://www.crunchyroll.com/account/subscription', emoji: 'JT' },
  { id: 6, name: 'WorldBegemotKot', amount: 2,   day: 19, color: '#c97cff', url: '',                                           emoji: 'WB' },
  { id: 7, name: 'Gym',             amount: 70,  day: 1,  color: '#ffcc4d', url: '',                                           emoji: '💪' },
  { id: 8, name: 'Credit',          amount: 363, day: 15, color: '#ff4d6a', url: '',                                           emoji: '💳' },
  { id: 9, name: 'Oura Ring',       amount: 6,   day: 19, color: '#4dffd2', url: 'https://cloud.ouraring.com/user/settings/subscription', emoji: 'OR' },
];

const COLORS = [
  '#7c6aff','#ff4d6a','#ff7c4d','#ffcc4d',
  '#2ecc8a','#4dffd2','#4d9eff','#c97cff',
  '#ff4d4d','#a8a8b3','#ff6eb4','#f0f0f5',
];

// ── STATE ──
let subs = [];
let activeTab = 'all';
let editingId = null;
let selectedColor = COLORS[0];
let deleteTargetId = null;

// ── STORAGE ──
function load() {
  try {
    const raw = localStorage.getItem('subtracker_v2');
    subs = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_SUBS));
  } catch { subs = JSON.parse(JSON.stringify(DEFAULT_SUBS)); }
}
function save() {
  localStorage.setItem('subtracker_v2', JSON.stringify(subs));
}

// ── DATE UTILS ──
function today() { return new Date(); }
function daysUntil(day) {
  const now = today();
  const d = now.getDate();
  if (day === d) return 0;
  if (day > d) return day - d;
  // next month
  const next = new Date(now.getFullYear(), now.getMonth() + 1, day);
  return Math.ceil((next - now) / 86400000);
}
function ordinal(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

// ── RENDER ──
function getStatus(sub) {
  const d = daysUntil(sub.day);
  if (d === 0) return 'today';
  if (d <= 3) return 'soon';
  return 'normal';
}

function initials(name) {
  return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function renderCard(sub) {
  const status = getStatus(sub);
  const d = daysUntil(sub.day);
  const label = sub.emoji || initials(sub.name);

  let badgeHtml = '';
  if (status === 'today') badgeHtml = `<span class="card-badge badge-today">TODAY</span>`;
  else if (status === 'soon') badgeHtml = `<span class="card-badge badge-soon">in ${d}d</span>`;

  const manageBtn = sub.url
    ? `<a class="action-btn" href="${sub.url}" target="_blank" rel="noopener" title="Manage subscription">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>`
    : '';

  const card = document.createElement('div');
  card.className = `card${status === 'today' ? ' today-card' : status === 'soon' ? ' soon-card' : ''}`;
  card.dataset.id = sub.id;
  card.innerHTML = `
    <div class="card-icon" style="background:${hexToRgba(sub.color,0.15)};color:${sub.color};">${label}</div>
    <div class="card-body">
      <div class="card-name">${sub.name}</div>
      <div class="card-meta">
        ${ordinal(sub.day)} each month
        ${badgeHtml}
      </div>
    </div>
    <div class="card-right">
      <div class="card-amount" style="color:${sub.color}">$${sub.amount % 1 === 0 ? sub.amount : sub.amount.toFixed(2)}</div>
      <div class="card-actions">
        ${manageBtn}
        <button class="action-btn" data-edit="${sub.id}" title="Edit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="action-btn delete" data-delete="${sub.id}" title="Remove">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  return card;
}

function renderList() {
  const list = document.getElementById('subList');
  list.innerHTML = '';

  let filtered = [...subs];
  if (activeTab === 'upcoming') {
    filtered = subs.filter(s => daysUntil(s.day) <= 7);
  }
  // Sort by days until payment
  filtered.sort((a,b) => daysUntil(a.day) - daysUntil(b.day));

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">${activeTab === 'upcoming' ? '✅' : '💸'}</div><div class="empty-text">${activeTab === 'upcoming' ? 'No payments in the next 7 days' : 'No subscriptions yet.<br>Tap + to add one.'}</div></div>`;
    return;
  }

  filtered.forEach(sub => list.appendChild(renderCard(sub)));
}

function renderHeader() {
  const total = subs.reduce((s,x) => s + Number(x.amount), 0);
  document.getElementById('totalAmount').textContent = `$${total % 1 === 0 ? total : total.toFixed(2)}`;
  document.getElementById('subCount').textContent = subs.length;
  renderUpcomingStrip();
}

function renderUpcomingStrip() {
  const strip = document.getElementById('upcomingStrip');
  strip.innerHTML = '';
  const upcoming = subs
    .map(s => ({ ...s, d: daysUntil(s.day) }))
    .filter(s => s.d <= 5)
    .sort((a,b) => a.d - b.d);

  if (upcoming.length === 0) {
    strip.innerHTML = '<div class="upcoming-chip"><div class="chip-dot"></div>No payments this week</div>';
    return;
  }
  upcoming.forEach(s => {
    const cls = s.d === 0 ? 'today' : s.d <= 3 ? 'soon' : '';
    const label = s.d === 0 ? 'Today' : `in ${s.d}d`;
    strip.innerHTML += `<div class="upcoming-chip ${cls}"><div class="chip-dot"></div>${s.name} · ${label}</div>`;
  });
}

function render() {
  renderHeader();
  renderList();
}

// ── MODAL ──
function openModal(sub = null) {
  editingId = sub ? sub.id : null;
  document.getElementById('modalTitle').textContent = sub ? 'Edit Subscription' : 'New Subscription';
  document.getElementById('inputName').value = sub ? sub.name : '';
  document.getElementById('inputAmount').value = sub ? sub.amount : '';
  document.getElementById('inputDay').value = sub ? sub.day : '';
  document.getElementById('inputUrl').value = sub ? (sub.url || '') : '';
  selectedColor = sub ? sub.color : COLORS[0];
  renderColorPicker();
  document.getElementById('modalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('inputName').focus(), 350);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
}

function renderColorPicker() {
  const picker = document.getElementById('colorPicker');
  picker.innerHTML = '';
  COLORS.forEach(c => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (c === selectedColor ? ' selected' : '');
    sw.style.background = c;
    sw.addEventListener('click', () => {
      selectedColor = c;
      renderColorPicker();
    });
    picker.appendChild(sw);
  });
}

function saveSub() {
  const name = document.getElementById('inputName').value.trim();
  const amount = parseFloat(document.getElementById('inputAmount').value);
  const day = parseInt(document.getElementById('inputDay').value);
  const url = document.getElementById('inputUrl').value.trim();

  if (!name || isNaN(amount) || amount <= 0 || isNaN(day) || day < 1 || day > 31) {
    showToast('Fill in name, amount, and a valid day (1–31)');
    return;
  }

  if (editingId) {
    const idx = subs.findIndex(s => s.id === editingId);
    if (idx !== -1) {
      subs[idx] = { ...subs[idx], name, amount, day, url, color: selectedColor };
    }
    showToast('Updated ✓');
  } else {
    const id = Date.now();
    subs.push({ id, name, amount, day, url, color: selectedColor, emoji: initials(name) });
    showToast('Added ✓');
  }

  save();
  render();
  closeModal();
}

// ── DELETE ──
function confirmDelete(id) {
  const sub = subs.find(s => s.id === id);
  if (!sub) return;
  deleteTargetId = id;
  document.getElementById('confirmName').textContent = sub.name;
  document.getElementById('confirmOverlay').classList.add('open');
}

function deleteSub() {
  subs = subs.filter(s => s.id !== deleteTargetId);
  save(); render();
  document.getElementById('confirmOverlay').classList.remove('open');
  showToast('Removed');
  deleteTargetId = null;
}

// ── NOTIFICATIONS ──
async function requestNotifications() {
  if (!('Notification' in window)) { showToast('Notifications not supported'); return; }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    document.getElementById('notifyBtn').classList.add('active');
    localStorage.setItem('notif_enabled', '1');
    showToast('Notifications enabled ✓');
    scheduleCheck();
  } else {
    showToast('Notifications blocked');
  }
}

function scheduleCheck() {
  // Check daily — simplified: run on load and alert if today/tomorrow
  const enabled = localStorage.getItem('notif_enabled') === '1';
  if (!enabled || Notification.permission !== 'granted') return;
  subs.forEach(sub => {
    const d = daysUntil(sub.day);
    if (d === 0) {
      new Notification(`💳 ${sub.name} charges today`, { body: `$${sub.amount} will be charged today`, icon: 'icons/icon-192.png' });
    } else if (d === 1) {
      new Notification(`⚠️ ${sub.name} charges tomorrow`, { body: `$${sub.amount} — due tomorrow (${ordinal(sub.day)})`, icon: 'icons/icon-192.png' });
    } else if (d === 3) {
      new Notification(`🔔 ${sub.name} in 3 days`, { body: `$${sub.amount} — due on the ${ordinal(sub.day)}`, icon: 'icons/icon-192.png' });
    }
  });
}

// ── TOAST ──
let toastTimer;
function showToast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ── SERVICE WORKER ──
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

// ── EVENTS ──
document.getElementById('fabBtn').addEventListener('click', () => openModal());
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('btnCancel').addEventListener('click', closeModal);
document.getElementById('btnSave').addEventListener('click', saveSub);
document.getElementById('notifyBtn').addEventListener('click', requestNotifications);
document.getElementById('confirmNo').addEventListener('click', () => {
  document.getElementById('confirmOverlay').classList.remove('open');
  deleteTargetId = null;
});
document.getElementById('confirmYes').addEventListener('click', deleteSub);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    activeTab = t.dataset.tab;
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderList();
  });
});

// List event delegation
document.getElementById('subList').addEventListener('click', e => {
  const editBtn = e.target.closest('[data-edit]');
  const delBtn  = e.target.closest('[data-delete]');
  if (editBtn) { const sub = subs.find(s => s.id === Number(editBtn.dataset.edit)); if (sub) openModal(sub); }
  if (delBtn)  { confirmDelete(Number(delBtn.dataset.delete)); }
});

// ── INIT ──
load();
registerSW();
render();

// Restore notification state
if (localStorage.getItem('notif_enabled') === '1' && Notification.permission === 'granted') {
  document.getElementById('notifyBtn').classList.add('active');
  scheduleCheck();
}
