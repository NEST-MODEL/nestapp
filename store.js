/**
 * NEST — Store
 * Простой реактивный стейт
 */

const Store = {
  _state: {
    user: null,
    activeServer: null,
    activeChannel: null,
    activePage: 'feed',
    unreadCounts: {},
    voiceRoom: null,
    isMuted: false,
    isDeafened: false,
    sidebarOpen: false,
  },
  _listeners: {},

  get(key) { return this._state[key]; },

  set(key, value) {
    this._state[key] = value;
    this._emit(key, value);
  },

  on(key, cb) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(cb);
    return () => { this._listeners[key] = this._listeners[key].filter(l => l !== cb); };
  },

  _emit(key, value) {
    (this._listeners[key] || []).forEach(cb => cb(value));
  },
};

window.Store = Store;
