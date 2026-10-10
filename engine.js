// Zipper math engine - pure arithmetic, shared by the page and the tests.
// Every borrowed number is a labeled sewing norm, not a rule.
(function (root) {
"use strict";

// Labeled norms (common sewing references):
// - Gauge: the size number is roughly the closed-chain width in millimeters.
//   Labeled widths: #3 = 3.5 mm, #4 = 4 mm, #5 = 5.5 mm, #8 = 8 mm, #10 = 10 mm.
// - Uses: #3 suits skirts, dresses and pillows; #5 suits jackets and bags; #8 and #10 suit coats, tents and gear.
// - Length: stock zippers come in fixed centimeter sizes; buy the next size up from the opening plus about 2 cm.
// - Shortening: cut from the top at the target plus about 1.5 cm, then add one top stop per side.

var GAUGES = [
  { size: 3, width: 3.5, use: "skirts, dresses and pillows" },
  { size: 4, width: 4, use: "trousers and light skirts" },
  { size: 5, width: 5.5, use: "jackets and bags" },
  { size: 8, width: 8, use: "coats and heavier gear" },
  { size: 10, width: 10, use: "tents and heavy gear" }
];
var STOCK = [10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100];

function r1(x) { return Math.round(x * 10) / 10; }
function positive() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (typeof v !== "number" || !isFinite(v) || v <= 0) return false;
  }
  return true;
}

function gaugeMatch(widthMm) {
  if (!positive(widthMm)) return { error: "chain width must be positive" };
  var best = null;
  for (var i = 0; i < GAUGES.length; i++) {
    var g = GAUGES[i];
    var d = Math.abs(widthMm - g.width);
    if (best === null || d < best.diff) best = { size: g.size, width: g.width, use: g.use, diff: d };
  }
  return { widthMm: r1(widthMm), size: best.size, labeledWidth: best.width, use: best.use, offBy: r1(best.diff) };
}

function renderGauge(r) {
  if (r.error) return r.error;
  return "A " + r.widthMm + " mm closed chain is closest to a #" + r.size + " zipper (labeled " + r.labeledWidth +
    " mm, off by " + r.offBy + " mm) - the labeled pick for " + r.use + ".";
}

function lengthPlan(openingCm) {
  if (!positive(openingCm)) return { error: "opening length must be positive" };
  var needed = r1(openingCm + 2);
  for (var i = 0; i < STOCK.length; i++) {
    if (STOCK[i] >= needed) {
      return { openingCm: r1(openingCm), needed: needed, stock: STOCK[i], extra: r1(STOCK[i] - openingCm) };
    }
  }
  return { error: "opening is longer than labeled stock sizes - buy chain by the meter" };
}

function renderLength(r) {
  if (r.error) return r.error;
  return "A " + r.openingCm + " cm opening wants at least " + r.needed + " cm (labeled +2 cm allowance), so buy the " +
    r.stock + " cm stock zipper - " + r.extra + " cm of extra tape to trim.";
}

function shortenZip(currentCm, targetCm) {
  if (!positive(currentCm, targetCm)) return { error: "zipper lengths must be positive" };
  if (targetCm >= currentCm) return { error: "target must be shorter than the zipper" };
  var cutAt = r1(targetCm + 1.5);
  var waste = r1(currentCm - cutAt);
  return { currentCm: r1(currentCm), targetCm: r1(targetCm), cutAt: cutAt, waste: waste, stops: 2 };
}

function renderShorten(r) {
  if (r.error) return r.error;
  return "Measure " + r.cutAt + " cm up from the bottom stop (target " + r.targetCm + " cm plus a labeled 1.5 cm allowance), " +
    "cut there, and crimp " + r.stops + " top stops - one per side. You remove " + r.waste + " cm of the " + r.currentCm + " cm zipper.";
}

var api = {
  gaugeMatch: gaugeMatch,
  lengthPlan: lengthPlan,
  shortenZip: shortenZip,
  renderGauge: renderGauge,
  renderLength: renderLength,
  renderShorten: renderShorten
};
if (typeof module !== "undefined" && module.exports) module.exports = api;
root.ZipperMath = api;
})(typeof window !== "undefined" ? window : globalThis);
