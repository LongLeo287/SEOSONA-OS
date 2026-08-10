# SEOSONA Facebook Group Factory Context

This directory is the OS-owned, versioned context source for the SEOSONA Facebook Group Content Factory V1.

`context.v1.json` is a manifest. The local Content Companion resolves the four referenced files at batch creation time and Content creates an immutable `contextRevision` snapshot from that resolved data.

`brand-kit-reference.v1.json` pins the canonical Video BrandKit by logical URI,
semantic version, and SHA-256. `brand-profile.v1.json` repeats that small pin so
the context remains self-describing. The Companion resolves the physical file
only from `SEOSONA_BRAND_KIT_FILE` and rejects version or digest drift. Do not
copy the Video asset collection into this OS namespace.

Keep `evidence-packet.v1.json` empty until each factual claim has a verified source. An evidence item must have a stable `id`, the exact supported claim, a source URL or internal evidence reference, and verification metadata. Content blocks any draft claim that references a missing evidence id.

Do not add access tokens, provider cookies, local paths, or Facebook credentials to these files.
