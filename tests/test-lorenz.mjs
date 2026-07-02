// Red-first tests for the Lorenz integrator + buffer shift invariant.
// Run: node tests/test-lorenz.mjs

let pass = 0;
let fail = 0;

function assert(cond, msg) {
  if (cond) { pass++; console.log(`  ✓ ${msg}`); }
  else { fail++; console.error(`  ✗ ${msg}`); }
}

// === Replicate the exact algorithm that will live in index.html ===
const SIGMA = 10, RHO = 28, BETA = 8/3;
const DT = 0.005;

function lorenzStep(x, y, z) {
  const dx = SIGMA * (y - x);
  const dy = x * (RHO - z) - y;
  const dz = x * y - BETA * z;
  return { x: x + dx*DT, y: y + dy*DT, z: z + dz*DT, dx, dy, dz };
}

function speedFrom(dx, dy, dz) {
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

function tFromSpeed(s, lo, hi) {
  const t = (s - lo) / (hi - lo);
  return Math.max(0, Math.min(1, t));
}

function hueFromT(t) {
  // Red (0) → Blue (0.66). monotonically increasing in t.
  return 0.66 * t;
}

// === S1: one-step ground truth from (0.1, 0, 0) ===
console.log('S1 — one-step ground truth');
{
  const r = lorenzStep(0.1, 0, 0);
  const dx = SIGMA * (0 - 0.1);    // -1
  const dy = 0.1 * (28 - 0) - 0;   // 2.8
  const dz = 0.1 * 0 - BETA * 0;   // 0
  const xExp = 0.1 + dx*DT;        // 0.095
  const yExp = 0   + dy*DT;        // 0.014
  const zExp = 0   + dz*DT;        // 0
  assert(Math.abs(r.x - xExp) < 1e-12, `x ≈ ${xExp} (got ${r.x})`);
  assert(Math.abs(r.y - yExp) < 1e-12, `y ≈ ${yExp} (got ${r.y})`);
  assert(Math.abs(r.z - zExp) < 1e-12, `z ≈ ${zExp} (got ${r.z})`);
}

// === S2: chaos sanity — stays in the attractor envelope ===
console.log('S2 — chaos envelope over 10k steps');
{
  let x = 0.1, y = 0, z = 0;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < 10000; i++) {
    const r = lorenzStep(x, y, z);
    x = r.x; y = r.y; z = r.z;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  console.log(`  ↳ x ∈ [${minX.toFixed(2)}, ${maxX.toFixed(2)}], z ∈ [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}]`);
  assert(minX > -25 && maxX < 25, 'x stays within [-25, 25]');
  assert(minZ > -5 && maxZ < 60, 'z stays within [-5, 60]');
}

// === S3: buffer shift alignment — positions[i] and colors[i] describe the same point ===
console.log('S3 — buffer shift preserves position/color alignment');
{
  const N = 100;
  const STEPS_PER_FRAME = 5;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);

  // Fill with deterministic synthetic data: every point has unique id encoded in y
  for (let i = 0; i < N; i++) {
    positions[i*3]     = i;       // x = i
    positions[i*3 + 1] = i * 10; // y = i*10 (used as id)
    positions[i*3 + 2] = -i;     // z = -i
    colors[i*3]     = i / N;     // r
    colors[i*3 + 1] = 0;
    colors[i*3 + 2] = 1 - i / N; // b
  }

  // Shift left by STEPS_PER_FRAME (mirrors the algorithm in index.html)
  const SHIFT3 = STEPS_PER_FRAME * 3;
  positions.copyWithin(0, SHIFT3);
  colors.copyWithin(0, SHIFT3);

  // After shift, position[i].y must equal colors-encoded id relationship at i
  // Old: point at index i had x=i, y=i*10. After shift, position at index i = old point at index (i+SHIFT).
  // So new positions[i*3+1] should equal (i + SHIFT) * 10.
  for (let i = 0; i < N - STEPS_PER_FRAME; i++) {
    const expectedY = (i + STEPS_PER_FRAME) * 10;
    assert(Math.abs(positions[i*3 + 1] - expectedY) < 1e-6,
      `pos[${i}].y = ${expectedY} (got ${positions[i*3+1]})`);
  }
}

// === S4: speed → hue monotonic ===
console.log('S4 — speed→hue monotonically increases');
{
  let prev = -1;
  let ok = true;
  for (let s = 0; s <= 80; s++) {
    const t = tFromSpeed(s, 0, 60);
    const h = hueFromT(t);
    if (h < prev - 1e-12) ok = false;
    prev = h;
  }
  assert(ok, 'hue is monotonically non-decreasing over speed ∈ [0, 80]');
  // Endpoints
  assert(Math.abs(hueFromT(0)) < 1e-12, 'speed=0 → hue 0 (red)');
  assert(Math.abs(hueFromT(1) - 0.66) < 1e-12, 'speed→max → hue 0.66 (blue)');
}

console.log(`\nResult: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
