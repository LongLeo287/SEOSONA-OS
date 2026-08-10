import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { validateBrandReference } from "./validate-brand-reference.mjs";

const projectDirectory = import.meta.dirname;
const referenceFile = path.join(projectDirectory, "brand-kit-reference.v1.json");
const brandProfileFile = path.join(projectDirectory, "brand-profile.v1.json");

async function readCanonicalPolicy() {
  return {
    reference: JSON.parse(await readFile(referenceFile, "utf8")),
    brandProfile: JSON.parse(await readFile(brandProfileFile, "utf8")),
  };
}

test("OS publishes a portable versioned BrandKit reference", async () => {
  const { reference, brandProfile } = await readCanonicalPolicy();
  const result = validateBrandReference({ reference, brandProfile });

  assert.equal(result.valid, true, result.errors.join("\n"));
  assert.equal(
    reference.ref,
    "seosona-brand://video/SEOSONA/brand-kit.v1.json",
  );
  assert.equal(reference.version, "1.0.0");
  assert.match(reference.sha256, /^[a-f0-9]{64}$/);
  assert.equal(reference.resolution.env, "SEOSONA_BRAND_KIT_FILE");
});

test("reference rejects absolute and machine-specific paths", async () => {
  const { reference, brandProfile } = await readCanonicalPolicy();
  reference.ref = `${String.fromCharCode(90, 58, 92)}brand\\brand-kit.v1.json`;

  const result = validateBrandReference({ reference, brandProfile });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("logical seosona-brand URI")));
});

test("reference rejects a brand profile that omits the same logical reference", async () => {
  const { reference, brandProfile } = await readCanonicalPolicy();
  delete brandProfile.brand.visual.brandKit;

  const result = validateBrandReference({ reference, brandProfile });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("brand profile")));
});

test("reference detects BrandKit digest drift", async () => {
  const { reference, brandProfile } = await readCanonicalPolicy();
  const changedBrandKit = Buffer.from(
    JSON.stringify({ version: reference.version, changed: true }),
  );
  const changedDigest = createHash("sha256").update(changedBrandKit).digest("hex");
  assert.notEqual(changedDigest, reference.sha256);

  const result = validateBrandReference({
    reference,
    brandProfile,
    brandKitBuffer: changedBrandKit,
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("digest mismatch")));
});

test("reference accepts the live Video BrandKit when the environment provides it", async (t) => {
  const brandKitFile = process.env.SEOSONA_BRAND_KIT_FILE;
  if (!brandKitFile) {
    t.skip("SEOSONA_BRAND_KIT_FILE is not set");
    return;
  }
  const { reference, brandProfile } = await readCanonicalPolicy();
  const brandKitBuffer = await readFile(brandKitFile);
  const result = validateBrandReference({
    reference,
    brandProfile,
    brandKitBuffer,
  });

  assert.equal(result.valid, true, result.errors.join("\n"));
});
