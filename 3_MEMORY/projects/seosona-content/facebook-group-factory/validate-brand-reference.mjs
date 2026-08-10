import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const LOGICAL_REFERENCE =
  "seosona-brand://video/SEOSONA/brand-kit.v1.json";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((output, key) => {
      output[key] = canonicalize(value[key]);
      return output;
    }, {});
  }
  return value;
}

function canonicalDigest(value) {
  return createHash("sha256")
    .update(JSON.stringify(canonicalize(value)))
    .digest("hex");
}

export function validateBrandReference({
  reference,
  brandProfile,
  brandKitBuffer,
}) {
  const errors = [];
  const profileReference = brandProfile?.brand?.visual?.brandKit;

  if (
    reference?.ref !== LOGICAL_REFERENCE ||
    path.isAbsolute(reference?.ref ?? "") ||
    /^[a-zA-Z]:[\\/]/.test(reference?.ref ?? "")
  ) {
    errors.push("BrandKit ref must be the canonical logical seosona-brand URI");
  }
  if (!/^\d+\.\d+\.\d+$/.test(reference?.version ?? "")) {
    errors.push("BrandKit version must use semantic version syntax");
  }
  if (!/^[a-f0-9]{64}$/.test(reference?.sha256 ?? "")) {
    errors.push("BrandKit sha256 must be 64 lowercase hexadecimal characters");
  }
  if (reference?.resolution?.env !== "SEOSONA_BRAND_KIT_FILE") {
    errors.push("BrandKit resolution must use SEOSONA_BRAND_KIT_FILE");
  }
  if (
    profileReference?.ref !== reference?.ref ||
    profileReference?.version !== reference?.version ||
    profileReference?.sha256 !== reference?.sha256
  ) {
    errors.push("BrandKit reference in brand profile must match the canonical reference");
  }

  if (brandKitBuffer) {
    try {
      const brandKit = JSON.parse(brandKitBuffer.toString("utf8"));
      if (canonicalDigest(brandKit) !== reference?.sha256) {
        errors.push("BrandKit digest mismatch");
      }
      if (brandKit.version !== reference?.version) {
        errors.push("BrandKit version mismatch");
      }
    } catch {
      errors.push("BrandKit file is not valid JSON");
    }
  }

  return { valid: errors.length === 0, errors };
}

async function runCli() {
  const brandKitFlag = process.argv.indexOf("--brand-kit-file");
  const brandKitFile = brandKitFlag >= 0 ? process.argv[brandKitFlag + 1] : undefined;
  if (!brandKitFile) {
    process.stderr.write("Missing --brand-kit-file\n");
    process.exitCode = 2;
    return;
  }

  const directory = import.meta.dirname;
  const [reference, brandProfile, brandKitBuffer] = await Promise.all([
    readFile(path.join(directory, "brand-kit-reference.v1.json"), "utf8").then(JSON.parse),
    readFile(path.join(directory, "brand-profile.v1.json"), "utf8").then(JSON.parse),
    readFile(brandKitFile),
  ]);
  const result = validateBrandReference({ reference, brandProfile, brandKitBuffer });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.valid) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runCli();
}
