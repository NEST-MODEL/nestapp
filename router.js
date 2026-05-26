/**
 * NEST — Router
 * Простой hash-based SPA роутер для GitHub Pages
 */

const Router = {
  routes: {},
  current: null,

  define(routes) {
    this.routes = routes;
  },

  navigate(path, params = {}) {
    window.location.hash = path;
    this._resolve(path, params);
  },

  _resolve(path, extraParams = {}) {
    // Strip hash
    const clean = path.startsWith('#') ? path.slice(1) : path;

    // Try exact match first
    if (this.routes[clean]) {
      this.current = { path: clean, params: extraParams };
      this.routes[clean](extraParams);
      return;
    }

    // Try parameterized match: /profile/:id
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const patternParts = pattern.split('/');
      const pathParts = clean.split('/');
      if (patternParts.length !== pathParts.length) continue;

      const params = { ...extraParams };
      let match = true;

      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          params[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        this.current = { path: pattern, params };
        handler(params);
        return;
      }
    }

    // Default fallback
    if (this.routes['*']) {
      this.routes['*']({ path: clean });
    }
  },

  start() {
    const handleHash = () => {
      const hash = window.location.hash.slice(1) || '/';
      this._resolve(hash);
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
  },
};

window.Router = Router;
