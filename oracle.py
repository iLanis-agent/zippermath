#!/usr/bin/env python3
"""Independent oracle for Zipper math. Mirrors engine.js float ops exactly."""
import json, math

GAUGES = [(3, 3.5, "skirts, dresses and pillows"), (4, 4, "trousers and light skirts"),
          (5, 5.5, "jackets and bags"), (8, 8, "coats and heavier gear"), (10, 10, "tents and heavy gear")]
STOCK = [10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100]

def r1(x): return math.floor(x * 10 + 0.5) / 10

def num(x):
    if x == int(x) and abs(x) < 1e15:
        return str(int(x))
    return repr(x)

def gauge_match(width_mm):
    if not (isinstance(width_mm, (int, float)) and math.isfinite(width_mm) and width_mm > 0):
        return {"error": "chain width must be positive"}
    best = None
    for size, width, use in GAUGES:
        d = abs(width_mm - width)
        if best is None or d < best[3]:
            best = (size, width, use, d)
    return {"widthMm": r1(width_mm), "size": best[0], "labeledWidth": best[1], "use": best[2], "offBy": r1(best[3])}

def render_gauge(r):
    if "error" in r: return r["error"]
    return (f"A {num(r['widthMm'])} mm closed chain is closest to a #{r['size']} zipper (labeled {num(r['labeledWidth'])}"
            f" mm, off by {num(r['offBy'])} mm) - the labeled pick for {r['use']}.")

def length_plan(opening_cm):
    if not (isinstance(opening_cm, (int, float)) and math.isfinite(opening_cm) and opening_cm > 0):
        return {"error": "opening length must be positive"}
    needed = r1(opening_cm + 2)
    for s in STOCK:
        if s >= needed:
            return {"openingCm": r1(opening_cm), "needed": needed, "stock": s, "extra": r1(s - opening_cm)}
    return {"error": "opening is longer than labeled stock sizes - buy chain by the meter"}

def render_length(r):
    if "error" in r: return r["error"]
    return (f"A {num(r['openingCm'])} cm opening wants at least {num(r['needed'])} cm (labeled +2 cm allowance), so buy the "
            f"{r['stock']} cm stock zipper - {num(r['extra'])} cm of extra tape to trim.")

def shorten_zip(current_cm, target_cm):
    if not all(isinstance(v, (int, float)) and math.isfinite(v) and v > 0 for v in (current_cm, target_cm)):
        return {"error": "zipper lengths must be positive"}
    if target_cm >= current_cm:
        return {"error": "target must be shorter than the zipper"}
    cut_at = r1(target_cm + 1.5)
    waste = r1(current_cm - cut_at)
    return {"currentCm": r1(current_cm), "targetCm": r1(target_cm), "cutAt": cut_at, "waste": waste, "stops": 2}

def render_shorten(r):
    if "error" in r: return r["error"]
    return (f"Measure {num(r['cutAt'])} cm up from the bottom stop (target {num(r['targetCm'])} cm plus a labeled 1.5 cm allowance), "
            f"cut there, and crimp {r['stops']} top stops - one per side. You remove {num(r['waste'])} cm of the {num(r['currentCm'])} cm zipper.")

cases = []
for w in [5.5, 3.5, 8, 4.5, 6, 10, 2, 7.9, 5.6, 0, -3, 12, 4.2, 9]:
    res = gauge_match(w)
    cases.append({"fn": "gaugeMatch", "args": [w], "result": res, "render": render_gauge(res)})
for o in [20, 18, 55, 10, 8, 43, 60, 70, 98, 99, 0, -10, 25.5, 13, 58.1]:
    res = length_plan(o)
    cases.append({"fn": "lengthPlan", "args": [o], "result": res, "render": render_length(res)})
for c, t in [(60, 45), (50, 50), (50, 55), (30, 25), (100, 60), (25, 20), (0, 45), (60, 0),
             (60, -5), (40, 38.5), (80, 79), (15, 10)]:
    res = shorten_zip(c, t)
    cases.append({"fn": "shortenZip", "args": [c, t], "result": res, "render": render_shorten(res)})

with open("expected.json", "w") as f:
    json.dump(cases, f, separators=(",", ":"))
    f.write("\n")
print(len(cases), "cases written")
