/*
 * core.js — the app kernel.
 *
 * Responsibilities (and ONLY these):
 *   1. A module registry so each feature lives in its own file.
 *   2. A small cached JSON loader that reads from ../data/<name>.json.
 *   3. Tab bar rendering + switching between modules.
 *
 * The kernel knows nothing about game logic. It never interprets the
 * meaning of any field — modules do that. Data lives in /data as JSON.
 */
(function (global) {
  'use strict';

  var DATA_BASE = '../data/';

  var modules = [];      // [{ id, label, mount }]
  var jsonCache = {};    // name -> Promise<parsed JSON>
  var activeId = null;

  /**
   * Register a feature module. Call this from a module file at load time.
   * @param {{id:string, label:string, mount:(el:HTMLElement, ctx:object)=>void}} mod
   */
  function registerModule(mod) {
    if (!mod || !mod.id || !mod.label || typeof mod.mount !== 'function') {
      throw new Error('registerModule: need { id, label, mount() }');
    }
    modules.push(mod);
  }

  /**
   * Load and cache a JSON file from /data. Returns a Promise.
   * On any failure resolves to null so modules can show a friendly placeholder.
   * @param {string} name  e.g. "items" -> ../data/items.json
   * @returns {Promise<any|null>}
   */
  function loadJSON(name) {
    if (jsonCache[name]) return jsonCache[name];
    var p = fetch(DATA_BASE + name + '.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn('[NMS] could not load data "' + name + '":', err.message);
        return null;
      });
    jsonCache[name] = p;
    return p;
  }

  function renderTabs() {
    var bar = document.getElementById('tabbar');
    bar.innerHTML = '';
    modules.forEach(function (mod) {
      var btn = document.createElement('button');
      btn.className = 'tab' + (mod.id === activeId ? ' tab--active' : '');
      btn.textContent = mod.label;
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', mod.id === activeId ? 'true' : 'false');
      btn.addEventListener('click', function () { activate(mod.id); });
      bar.appendChild(btn);
    });
  }

  function activate(id) {
    var mod = modules.filter(function (m) { return m.id === id; })[0];
    if (!mod) return;
    activeId = id;
    renderTabs();
    var view = document.getElementById('view');
    view.innerHTML = '';
    // Context handed to every module: just data access + a placeholder helper.
    mod.mount(view, { loadJSON: loadJSON, placeholder: placeholder });
  }

  /** Build a friendly empty/missing-data placeholder element. */
  function placeholder(message) {
    var box = document.createElement('div');
    box.className = 'placeholder';
    box.textContent = message;
    return box;
  }

  /** Boot the app: render tabs and open the first registered module. */
  function start() {
    if (!modules.length) {
      document.getElementById('view').appendChild(
        placeholder('No feature modules are loaded yet.')
      );
      return;
    }
    renderTabs();
    activate(modules[0].id);
  }

  global.NMS = {
    registerModule: registerModule,
    loadJSON: loadJSON,
    placeholder: placeholder,
    start: start
  };
})(window);
