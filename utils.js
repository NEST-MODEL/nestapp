/**
 * NEST — Utils
 */

// ── TIME ──
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'только что';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} д назад`;
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// ── AVATAR ──
function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase() || '??';
}

function avatarColors(id = '') {
  const colors = ['#FF8C42', '#4CAF50', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function renderAvatar(user, size = 36, cls = '') {
  if (!user) return `<div class="post-avatar ${cls}" style="width:${size}px;height:${size}px">?</div>`;
  if (user.avatar) {
    return `<div class="post-avatar ${cls}" style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;"><img src="${user.avatar}" alt="${user.username}" /></div>`;
  }
  const color = avatarColors(user.id);
  return `<div class="post-avatar ${cls}" style="width:${size}px;height:${size}px;background:${color}20;color:${color};border-radius:50%;">${getInitials(user.username)}</div>`;
}

// ── DOM ──
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') e.insertAdjacentHTML('beforeend', child);
    else if (child instanceof Node) e.appendChild(child);
  }
  return e;
}

function render(container, html) {
  if (typeof container === 'string') container = document.getElementById(container);
  if (!container) return;
  container.innerHTML = html;
}

// ── TOAST ──
function showToast(message, type = 'info', duration = 3000) {
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const colors = { success: 'var(--online)', error: 'var(--danger)', warning: 'var(--warning)', info: 'var(--accent)' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="color:${colors[type]};font-weight:bold">${icons[type]}</span> ${message}`;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.2s ease reverse';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

// ── MODAL ──
function openModal(html) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.classList.remove('hidden');
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ── TEXT ──
function escapeHtml(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseContent(content = '') {
  return escapeHtml(content)
    .replace(/@(\w+)/g, '<span class="mention">@$1</span>')
    .replace(/\n/g, '<br>');
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

// ── AUTO RESIZE TEXTAREA ──
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

// ── DEBOUNCE ──
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── EXPORT ──
window.Utils = { timeAgo, formatTime, getInitials, avatarColors, renderAvatar, $, $$, el, render, showToast, openModal, closeModal, escapeHtml, parseContent, formatNumber, autoResize, debounce };

// Shorthand globals
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
