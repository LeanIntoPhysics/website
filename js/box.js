// Lean into Physics, lesson 001, figure 1.1: two boxes, one rule. Colours come from the stylesheet, so it follows the theme.
// The rule must match `next` in LeanIntoPhysics/Lesson001.lean: 0 ↦ 1, everything else ↦ 2.
(function () {
  "use strict";

  var NEXT = [1, 2, 2, 2];
  var PRESSES = 8;   // columns shown
  var STEP_PX = 22;  // horizontal drag distance per state

  function runFrom(s) {
    var out = [], x = s;
    for (var i = 0; i <= PRESSES; i++) { out.push(x); x = NEXT[x]; }
    return out;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function init(fig) {
    var state = { a: 1, b: 3, steps: 0, drag: null };
    var dragInfo = null, moved = false;

    var controls = {
      a: fig.querySelector('.num-control[data-which="a"]'),
      b: fig.querySelector('.num-control[data-which="b"]')
    };
    var scales = {
      a: fig.querySelector('[data-scale="a"]'),
      b: fig.querySelector('[data-scale="b"]')
    };
    var trace = fig.querySelector("[data-trace]");
    var msgEl = fig.querySelector("[data-msg]");
    var nextBtn = fig.querySelector("[data-next]");
    var resetBtn = fig.querySelector("[data-reset]");

    function setStart(which, v) {
      state[which] = Math.max(0, Math.min(3, v));
      render();
    }

    function message(ra, rb) {
      var first = -1;
      for (var i = 0; i <= PRESSES; i++) {
        if (ra[i] % 2 !== rb[i] % 2) { first = i; break; }
      }
      if (state.a === state.b) return "Same starting state, so the same displays.";
      if (first === 0) return "The displays differ before any press.";
      if (first === -1 && state.steps >= 2) return "From " + state.a + " and from " + state.b +
        " the displays never differ: both runs have reached state 2 and stay there. One predictive state, two labels.";
      if (first !== -1 && first <= state.steps) return "The displays differ after " + first +
        (first === 1 ? " press" : " presses") + ": two different states.";
      return "Same display so far. Press next.";
    }

    function row(cls, label, labelCls, cells) {
      var r = el("div", "tr " + cls);
      r.appendChild(el("span", "lab" + (labelCls ? " " + labelCls : ""), label));
      cells.forEach(function (c) { r.appendChild(c); });
      return r;
    }

    function render() {
      var ra = runFrom(state.a), rb = runFrom(state.b);

      ["a", "b"].forEach(function (w) {
        var btn = controls[w];
        btn.textContent = String(state[w]);
        btn.classList.toggle("dragging", state.drag === w);
        btn.setAttribute("aria-label", "Starting state of box " + w.toUpperCase() + ": " +
          state[w] + ". Use the arrow keys or drag sideways to change.");
        var sc = scales[w];
        sc.hidden = state.drag !== w;
        sc.textContent = "";
        [0, 1, 2, 3].forEach(function (v) {
          sc.appendChild(el("span", v === state[w] ? "on" : "", String(v)));
        });
      });

      var head = [], da = [], sa = [], db = [], sb = [], cmp = [];
      for (var i = 0; i <= PRESSES; i++) {
        var vis = i <= state.steps;
        head.push(el("span", "c" + (i === state.steps ? " now" : ""), String(i)));
        da.push(el("span", "c" + (vis ? "" : " hidden"), vis ? String(ra[i] % 2) : "·"));
        db.push(el("span", "c" + (vis ? "" : " hidden"), vis ? String(rb[i] % 2) : "·"));
        sa.push(el("span", "c", vis ? String(ra[i]) : ""));
        sb.push(el("span", "c", vis ? String(rb[i]) : ""));
        cmp.push(el("span", "c", vis && (ra[i] % 2 !== rb[i] % 2) ? "≠" : ""));
      }
      trace.textContent = "";
      trace.appendChild(row("head", "press", "", head));
      trace.appendChild(row("shows", "A shows", "", da));
      trace.appendChild(row("states", "state", "state", sa));
      trace.appendChild(row("shows b", "B shows", "", db));
      trace.appendChild(row("states", "state", "state", sb));
      trace.appendChild(row("cmp", "", "", cmp));

      msgEl.textContent = message(ra, rb);
      nextBtn.disabled = state.steps >= PRESSES;
    }

    ["a", "b"].forEach(function (w) {
      var btn = controls[w];

      btn.addEventListener("keydown", function (e) {
        var cur = state[w], v = null;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") v = (cur + 1) % 4;
        else if (e.key === "ArrowDown" || e.key === "ArrowLeft") v = (cur + 3) % 4;
        else if (e.key === "Home") v = 0;
        else if (e.key === "End") v = 3;
        if (v !== null) { e.preventDefault(); setStart(w, v); }
      });

      btn.addEventListener("pointerdown", function (e) {
        try { btn.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
        dragInfo = { which: w, x: e.clientX, v: state[w] };
        moved = false;
        state.drag = w;
        render();
      });

      btn.addEventListener("pointermove", function (e) {
        if (!dragInfo || dragInfo.which !== w) return;
        var step = Math.round((e.clientX - dragInfo.x) / STEP_PX);
        if (step !== 0) moved = true;
        var v = Math.max(0, Math.min(3, dragInfo.v + step));
        if (v !== state[w]) setStart(w, v);
      });

      function end() {
        if (!dragInfo) return;
        dragInfo = null;
        state.drag = null;
        render();
      }
      btn.addEventListener("pointerup", end);
      btn.addEventListener("pointercancel", end);

      btn.addEventListener("click", function () {
        if (moved) { moved = false; return; }
        setStart(w, (state[w] + 1) % 4);
      });
    });

    nextBtn.addEventListener("click", function () {
      state.steps = Math.min(PRESSES, state.steps + 1);
      render();
    });
    resetBtn.addEventListener("click", function () {
      state.steps = 0;
      render();
    });

    render();
  }

  document.querySelectorAll("[data-box-figure]").forEach(init);
})();
