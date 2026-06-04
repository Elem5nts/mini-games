/*
 * modules/faq.js — FAQ feature.
 *
 * Reads /data/faq.json and renders a searchable question/answer list.
 * Same pattern as modules/items.js: self-contained, owns its own DOM, and
 * only uses the kernel's { loadJSON, placeholder } context. The kernel is
 * not touched — this feature is wired in by one <script> tag in index.html.
 */
(function () {
  'use strict';

  function mount(root, ctx) {
    root.appendChild(ctx.placeholder('Loading FAQ…'));

    ctx.loadJSON('faq').then(function (entries) {
      root.innerHTML = '';

      if (!Array.isArray(entries) || entries.length === 0) {
        root.appendChild(ctx.placeholder(
          'No FAQ entries yet. Add entries to data/faq.json and they will appear here.'
        ));
        return;
      }

      var state = { query: '' };

      // --- Controls -------------------------------------------------------
      var controls = el('div', 'controls');

      var search = el('input', 'search');
      search.type = 'search';
      search.placeholder = 'Search questions…';
      search.setAttribute('aria-label', 'Search FAQ');
      search.addEventListener('input', function () {
        state.query = search.value.trim().toLowerCase();
        renderList();
      });

      controls.appendChild(search);
      root.appendChild(controls);

      // --- List container -------------------------------------------------
      var listWrap = el('div', 'list');
      root.appendChild(listWrap);

      function renderList() {
        listWrap.innerHTML = '';
        var matches = entries.filter(function (e) { return passes(e, state); });

        if (matches.length === 0) {
          listWrap.appendChild(ctx.placeholder('Nothing matches your search.'));
          return;
        }
        matches.forEach(function (e) { listWrap.appendChild(card(e)); });
      }

      renderList();
    });
  }

  function passes(e, state) {
    if (!state.query) return true;
    var hay = [e.question, e.answer, e.category, e.source].join(' ').toLowerCase();
    return hay.indexOf(state.query) !== -1;
  }

  function card(e) {
    var c = el('article', 'card');

    var q = el('h2', 'faq__q');
    q.textContent = e.question || '(no question)';
    c.appendChild(q);

    if (e.category) {
      var meta = el('div', 'card__meta');
      meta.appendChild(tag(e.category));
      c.appendChild(meta);
    }

    if (e.answer) {
      var a = el('p', 'faq__a');
      a.textContent = e.answer;
      c.appendChild(a);
    }

    if (e.source || e.updated) {
      var src = el('p', 'card__source');
      var bits = [];
      if (e.source) bits.push('Source: ' + e.source);
      if (e.updated) bits.push('Updated: ' + e.updated);
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

  NMS.registerModule({ id: 'faq', label: 'FAQ', mount: mount });
})();
