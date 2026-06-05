/*
 * modules/checklist.js — "Getting Started" checklist feature.
 *
 * Reads /data/checklist.json and renders steps grouped by phase and ordered
 * within each phase. Each step has an optional checkbox whose state is saved
 * in localStorage (per browser). Same pattern as items.js / faq.js: the file
 * is self-contained and only uses the kernel's { loadJSON, placeholder }.
 * The kernel is not touched — this feature is wired in by one <script> tag.
 */
(function () {
  'use strict';

  var PHASE_ORDER = ['First Hour', 'First Few Hours', 'First Week'];
  var STORE_KEY = 'nms_checklist_done';

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveDone(done) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(done)); }
    catch (e) { /* localStorage unavailable — checkboxes just won't persist */ }
  }

  function mount(root, ctx) {
    root.appendChild(ctx.placeholder('Loading checklist…'));

    ctx.loadJSON('checklist').then(function (steps) {
      root.innerHTML = '';

      if (!Array.isArray(steps) || steps.length === 0) {
        root.appendChild(ctx.placeholder(
          'No checklist yet. Add entries to data/checklist.json and they will appear here.'
        ));
        return;
      }

      var done = loadDone();

      // Group by phase.
      var byPhase = {};
      steps.forEach(function (s) {
        (byPhase[s.phase] = byPhase[s.phase] || []).push(s);
      });

      // Known phases first (in defined order), then any unexpected ones.
      var phases = PHASE_ORDER.filter(function (p) { return byPhase[p]; });
      Object.keys(byPhase).forEach(function (p) {
        if (phases.indexOf(p) === -1) phases.push(p);
      });

      var progress = el('p', 'checklist__progress');
      root.appendChild(progress);

      function updateProgress() {
        var total = steps.length;
        var n = steps.filter(function (s) { return done[s.id]; }).length;
        progress.textContent = n + ' of ' + total + ' steps done';
      }

      phases.forEach(function (phase) {
        var heading = el('h2', 'phase__title');
        heading.textContent = phase;
        root.appendChild(heading);

        var list = el('div', 'list');
        root.appendChild(list);

        byPhase[phase]
          .slice()
          .sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
          .forEach(function (s) { list.appendChild(stepCard(s, done, updateProgress)); });
      });

      updateProgress();
    });
  }

  function stepCard(step, done, onChange) {
    var c = el('article', 'card step' + (done[step.id] ? ' step--done' : ''));

    var head = el('label', 'step__head');
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'step__check';
    box.checked = !!done[step.id];
    box.addEventListener('change', function () {
      if (box.checked) { done[step.id] = true; c.classList.add('step--done'); }
      else { delete done[step.id]; c.classList.remove('step--done'); }
      saveDone(done);
      onChange();
    });
    head.appendChild(box);

    var title = el('span', 'step__title');
    title.textContent = step.title || step.what || step.id;
    head.appendChild(title);
    c.appendChild(head);

    if (step.what) c.appendChild(line('What', step.what, 'step__what'));
    if (step.why) c.appendChild(line('Why', step.why, 'step__why'));
    if (step.tip) c.appendChild(line('Tip', step.tip, 'step__tip'));

    return c;
  }

  // --- tiny DOM helpers -------------------------------------------------
  function line(label, text, cls) {
    var p = el('p', cls);
    p.innerHTML = '<strong>' + label + ':</strong> ' + escapeHtml(text);
    return p;
  }
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  NMS.registerModule({ id: 'checklist', label: 'Getting Started', mount: mount });
})();
