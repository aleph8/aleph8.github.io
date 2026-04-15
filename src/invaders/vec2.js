// Lightweight 2D vector helpers operating on plain {x, y} objects.
export const v2 = {
  add:       (a, b)    => ({ x: a.x + b.x, y: a.y + b.y }),
  sub:       (a, b)    => ({ x: a.x - b.x, y: a.y - b.y }),
  scale:     (a, s)    => ({ x: a.x * s,   y: a.y * s }),
  len:       (a)       => Math.sqrt(a.x * a.x + a.y * a.y),
  dist:      (a, b)    => v2.len(v2.sub(a, b)),
  dot:       (a, b)    => a.x * b.x + a.y * b.y,
  norm:      (a)       => { const l = v2.len(a) || 1; return { x: a.x / l, y: a.y / l }; },
  fromAngle: (a, l=1)  => ({ x: Math.cos(a) * l, y: Math.sin(a) * l }),
  angle:     (a)       => Math.atan2(a.y, a.x),
  clampLen:  (a, max)  => { const l = v2.len(a); return l > max ? v2.scale(v2.norm(a), max) : a; },
  addTo:     (a, b)    => { a.x += b.x; a.y += b.y; },       // mutates a
  scaleTo:   (a, s)    => { a.x *= s;   a.y *= s; },          // mutates a
  clampLenTo:(a, max)  => { const l = v2.len(a); if (l > max) { a.x = a.x/l*max; a.y = a.y/l*max; } },
};
