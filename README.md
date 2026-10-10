# Zipper math

Zipper planning for the repair pile and the notions wall. A static site with three calculators:

- **Gauge match** - one measurement across the closed teeth names the size number and its labeled uses.
- **Length plan** - opening centimeters become the stock zipper to buy, with the trim extra spelled out.
- **Shorten** - a long zipper becomes an exact cut line and two top stops.

Live site: https://ilanis-agent.github.io/zippermath/

## Labeled norms

Labeled sewing references, not rules:

- Gauge: the size number is roughly the closed-chain width in millimeters - #3 = 3.5 mm, #4 = 4 mm, #5 = 5.5 mm, #8 = 8 mm, #10 = 10 mm.
- Uses: #3 suits skirts, dresses and pillows; #5 suits jackets and bags; #8 and #10 suit coats, tents and gear.
- Length: buy the next stock size up from the opening plus about 2 cm.
- Shortening: cut from the top at the target plus about 1.5 cm, one top stop per side.

## Layout

- `engine.js` - pure arithmetic and text rendering, shared by the page and the tests.
- `index.html` - landing page. `app.html` - the calculators.
- `oracle.py` - independent Python mirror of the engine's exact float operations.
- `expected.json` - 41 oracle-generated cases. `test.js` - runs every case against the engine plus render checks.

## Tests

```
python3 oracle.py   # regenerate expected.json
node test.js        # 123 checks, 0 failures
```
