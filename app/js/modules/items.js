/*
 * modules/items.js — Item list feature (App v1).
 *
 * Reads /data/items.json and renders a searchable, category-filterable list
 * with a verdict "traffic light" (keep=green, sell=yellow, ignore=grey).
 *
 * This file is self-contained: it owns its own DOM and state. The kernel
 * only hands it a container element and a data accessor.
 */
(function () {
  'use strict';

  var VERDICT_CLASS = { keep: 'lamp--keep', sell: 'lamp--sell', ignore: 'lamp--ignore' };
  var VERDICT_LABEL = { keep: 'Keep', sell: 'Sell', ignore: 'Ignore' };
  var RARITY_LABEL = {
    common: 'Common', uncommon: 'Uncommon',
    rare: 'Rare', very_rare: 'Very rare'
  };

  function mount(root, ctx) {
    root.appendChild(ctx.placeholder('Loading items…'));

    ctx.loadJSON('items').then(function (items) {
      root.innerHTML = '';

      if (!Array.isArray(items) || items.length === 0) {
        root.appendChild(ctx.placeholder(
          'No items yet. Add entries to data/items.json and they will appear here.'
        ));
        return;
      }

      var state = { query: '', category: 'all' };

      // --- Controls -------------------------------------------------------
      var controls = el('div', 'controls');

      var search = el('input', 'search');
      search.type = 'search';
      search.placeholder = 'Search items…';
      search.setAttribute('aria-label', 'Search items');
      search.addEventListener('input', function () {
        state.query = search.value.trim().toLowerCase();
        renderList();
      });

      var select = el('select', 'category');
      select.setAttribute('aria-label', 'Filter by category');
      categoriesOf(items).forEach(function (cat) {
        var opt = document.createElement('option');
        opt.value = cat.value;
        opt.textContent = cat.label;
        select.appendChild(opt);
      });
      select.addEventListener('change', function () {
        state.category = select.value;
        renderList();
      });

      controls.appendChild(search);
      controls.appendChild(select);
      root.appendChild(controls);

      // --- List container -------------------------------------------------
      var listWrap = el('div', 'list');
      root.appendChild(listWrap);

      function renderList() {
        listWrap.innerHTML = '';
        var matches = items.filter(function (it) { return passes(it, state); });

        if (matches.length === 0) {
          listWrap.appendChild(ctx.placeholder('Nothing matches your filters.'));
          return;
        }
        matches.forEach(function (it) { listWrap.appendChild(card(it)); });
      }

      renderList();
    });
  }

  function passes(it, state) {
    if (state.category !== 'all' && (it.category || '') !== state.category) return false;
    if (!state.query) return true;
    var hay = [it.name, it.category, it.source, it.tips]
      .concat(Array.isArray(it.uses) ? it.uses : [])
      .join(' ').toLowerCase();
    return hay.indexOf(state.query) !== -1;
  }

  function categoriesOf(items) {
    var seen = {};
    items.forEach(function (it) { if (it.category) seen[it.category] = true; });
    var list = [{ value: 'all', label: 'All categories' }];
    Object.keys(seen).sort().forEach(function (c) {
      list.push({ value: c, label: c });
    });
    return list;
  }

  function card(it) {
    var c = el('article', 'card');

    var lamp = el('span', 'lamp ' + (VERDICT_CLASS[it.verdict] || 'lamp--unknown'));
    lamp.title = VERDICT_LABEL[it.verdict] || 'Unknown';
    lamp.setAttribute('aria-label', 'Verdict: ' + (VERDICT_LABEL[it.verdict] || 'unknown'));

    var head = el('div', 'card__head');
    head.appendChild(lamp);
    var name = el('h2', 'card__name');
    name.textContent = it.name || it.id || 'Unnamed';
    head.appendChild(name);
    c.appendChild(head);

    var meta = el('div', 'card__meta');
    if (it.category) meta.appendChild(tag(it.category));
    if (it.rarity) meta.appendChild(tag(RARITY_LABEL[it.rarity] || it.rarity, 'tag--rarity'));
    if (it.value != null && it.value !== '') meta.appendChild(tag('Value: ' + it.value));
    if (it.verdict) meta.appendChild(tag(VERDICT_LABEL[it.verdict] || it.verdict, 'tag--verdict'));
    if (meta.childNodes.length) c.appendChild(meta);

    if (Array.isArray(it.uses) && it.uses.length) {
      var uses = el('p', 'card__uses');
      uses.innerHTML = '<strong>Uses:</strong> ' + escapeHtml(it.uses.join(', '));
      c.appendChild(uses);
    }
    if (it.tips) {
      var tips = el('p', 'card__tips');
      tips.textContent = it.tips;
      c.appendChild(tips);
    }
    if (it.source || it.updated) {
      var src = el('p', 'card__source');
      var bits = [];
      if (it.source) bits.push('Source: ' + it.source);
      if (it.updated) bits.push('Updated: ' + it.updated);
      src.textContent = bits.join(' · ');
      c.appendChild(src);
    }
    return c;
  }

  // --- tiny DOM helpers -------------------------------------------------
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function tag(text, extra) {
    var t = el('span', 'tag' + (extra ? ' ' + extra : ''));
    t.textContent = text;
    return t;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  NMS.registerModule({ id: 'items', label: 'Items', mount: mount });
})();
