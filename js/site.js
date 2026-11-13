// Lean into Physics: theme switch and margin notes. Loaded on every page.
(function () {
  "use strict";
  var root = document.documentElement;

  // Theme: follows the system unless the reader picks one. The choice is a convenience, so storage may fail.
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var sw = document.querySelector(".theme-switch");
  function label() { if (sw) sw.textContent = current() === "dark" ? "light" : "dark"; }
  if (sw) {
    sw.hidden = false;
    label();
    sw.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("lip-theme", next); } catch (e) { /* private mode */ }
      label();
    });
  }

  // Notes sit open in the margin; at phone width they collapse under their paragraph.
  var narrow = window.matchMedia("(max-width: 560px)");
  function setNotes() {
    document.querySelectorAll("details.note").forEach(function (d) { d.open = !narrow.matches; });
    document.querySelectorAll("details.math").forEach(function (d) { d.open = true; });
  }
  setNotes();
  if (narrow.addEventListener) narrow.addEventListener("change", setNotes);
})();
