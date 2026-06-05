/*
 * modules/glossary.js — Glossary feature.
 *
 * Reads /data/glossary.json and renders a searchable list of terms with a
 * category filter. Same pattern as modules/items.js: self-contained, owns its
 * own DOM and state, uses only the kernel's { loadJSON, placeholder }. The
 * kernel is not touched — this feature is wired in by one <script> tag.
 */
(function () {
  'use strict';

  function mount(root, ctx) {
    root.appendChild(ctx.placeholder('Loading glossary…'));

    ctx.loadJSON('glossary').then(function (terms) {
      root.innerHTML = '';

      if (!Array.isArray(terms) || terms.length === 0) {
        root.appendChild(ctx.placeholder(
          'No glossary entries yet. Add entries to data/glossary.json and they will appear here.'
        ));
        return;
      }

      var state = { query: '', category: 'all' };

      // --- Controls -------------------------------------------------------
      var controls = el('div', 'controls');

      var search = el('input', 'search');
      search.type = 'search';
      search.placeholder = 'Search terms…';
      search.setAttribute('aria-label', 'Search glossary');
      search.addEventListener('input', function () {
        state.query = search.value.trim().toLowerCase();
        renderList();
      });

      var select = el('select', 'category');
      select.setAttribute('aria-label', 'Filter by category');
      categoriesOf(terms).forEach(function (cat) {
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
        var matches = terms.filter(function (t) { return passes(t, state); });

        if (matches.length === 0) {
          listWrap.appendChild(ctx.placeholder('Nothing matches your filters.'));
          return;
        }
        matches.forEach(function (t) { listWrap.appendChild(card(t)); });
      }

      renderList();
    });
  }

  function passes(t, state) {
    if (state.category !== 'all' && (t.category || '') !== state.category) return false;
    if (!state.query) return true;
    var hay = [t.term, t.category, t.plain, t.note].join(' ').toLowerCase();
    return hay.indexOf(state.query) !== -1;
  }

  function categoriesOf(terms) {
    var seen = {};
    terms.forEach(function (t) { if (t.category) seen[t.category] = true; });
    var list = [{ value: 'all', label: 'All categories' }];
    Object.keys(seen).sort().forEach(function (c) {
      list.push({ value: c, label: c });
    });
    return list;
  }

  function card(t) {
    var c = el('article', 'card');

    var term = el('h2', 'glossary__term');
    term.textContent = t.term || t.id || '(unnamed)';
    c.appendChild(term);

    if (t.category) {
      var meta = el('div', 'card__meta');
      meta.appendChild(tag(t.category));
      c.appendChild(meta);
    }

    if (t.plain) {
      var plain = el('p', 'glossary__plain');
      plain.textContent = t.plain;
      c.appendChild(plain);
    }
    if (t.note) {
      var note = el('p', 'glossary__note');
      note.innerHTML = '<strong>Note:</strong> ' + escapeHtml(t.note);
      c.appendChild(note);
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

  NMS.registerModule({ id: 'glossary', label: 'Glossary', mount: mount });
})();
