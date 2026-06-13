# Firecracker Storage Recovery Plan

## Goal

Keep using Firecracker and make workspace persistence work across sandbox recreate / TTL.

Success criteria:

1. A sandbox writes a file into `/home/user/workspace`.
2. The physical sandbox dies.
3. A new physical sandbox with the same logical identity sees the same file.

## Constraints

- Keep `Firecracker` as the secure runtime.
- Do not move to `qemu`.
- Change as few variables as possible per experiment.

## Phase 1: Firecracker + runtime-rs + current filesystem volume path

### Why

Right now the cluster is using the Golang Kata runtime/shim path. Kata storage work and direct-volume guidance appear to be concentrated around `runtime-rs`, so the first thing to check is whether the current failure is specific to the current runtime implementation.

### What to do

1. Audit the current Kata installation on the worker nodes:
   - which binaries are present
   - whether `runtime-rs` artifacts are already available
   - whether the current `kata-deploy` version can expose a Firecracker runtime backed by `runtime-rs`
2. If a Firecracker + `runtime-rs` path is available:
   - expose it as an isolated test path on one worker node only
   - keep the outer Kubernetes contract unchanged where possible (`RuntimeClass`-style Firecracker sandbox)
3. Run plain Kubernetes smoke tests, not OpenSandbox yet:
   - `hostPath` + Firecracker runtime-rs
   - `EFS PVC` + Firecracker runtime-rs
4. For each test:
   - inspect the mount inside the guest
   - write a file
   - verify it is visible from a debug pod mounting the same volume
   - recreate and verify the file survives

### Decision point

- If filesystem-backed volumes start working, the current issue is likely tied to the current Golang Kata runtime path.
- If they still do not work, move to Phase 2.

## Phase 2: Firecracker + direct block volume path

### Why

If ordinary filesystem mounts still fail, switch from “shared host filesystem mount” to “direct block device attached to the VM”, following Kata’s direct-volume design path as closely as possible.

### What to do

1. Read and reduce the Kata direct-volume guidance into an actionable checklist:
   - direct block device assignment design
   - block volume how-to
2. Verify whether the direct-volume path is actually available in our Firecracker packaging, or whether it is tied to a different runtime packaging path.
3. Run a plain Kubernetes smoke test:
   - Firecracker
   - one direct block volume
   - one sandbox
4. Inside the guest:
   - verify the block device exists
   - create a filesystem if needed
   - mount it into `/workspace`
   - write a file
5. Recreate the pod and verify the file survives.

### Decision point

- If direct volume works, adapt the product model to “one sandbox = one persistent disk”.
- If it does not, move to Phase 3.

## Phase 3: Firecracker + guest-side network mount fallback

### Why

If neither the current filesystem volume path nor the direct-volume path is workable, bypass the broken host->guest mount sharing path entirely and mount storage from inside the guest.

### What to do

1. Start a Firecracker sandbox without Kubernetes filesystem mounts.
2. From inside the guest, mount `EFS/NFS` directly into `/home/user/workspace`.
3. Verify:
   - file persistence across recreate
   - whether the same storage can be reused by the intended product model

## Integration order after a successful storage spike

Only after one of the storage spikes above works:

1. Wire the winning storage path back into OpenSandbox sandbox creation.
2. Restore relay recreate semantics on top of the working storage path.
3. Re-test:
   - TTL
   - recreate
   - file persistence
   - Claude state persistence

## Current execution order

1. Check whether Firecracker + `runtime-rs` is available in the current Kata installation.
2. If yes, run the minimal Firecracker + runtime-rs filesystem-volume smoke tests.
3. If no, document the gap and prepare the minimum packaging change needed before moving on.

## Phase 1 findings (2026-04-16)

- `runtime-rs` artifacts are present on the active Terraform worker nodes:
  - `/opt/kata/runtime-rs/bin/containerd-shim-kata-v2`
  - `/opt/kata/share/defaults/kata-containers/runtime-rs/configuration-rs-fc.toml`
- An isolated `kata-fc-rs` handler and `RuntimeClass` were created on a single active worker node for testing only.
- The Firecracker VMM does spawn under `runtime-rs`, so this is not a simple “binary missing” or “cannot start Firecracker at all” failure.
- But the path is not operational on the current node package:
  - even a `kata-fc-rs` pod with **no extra volumes** and `automountServiceAccountToken: false` fails in `prepare vm`
  - the Firecracker API socket comes up, but the VM remains only partially configured
  - observed state from the live `fc.sock`:
    - `drives: []`
    - `vsock: null`
    - `network-interfaces: []`
    - memory falls back near Firecracker defaults instead of the Kata config
- That means Phase 1 is blocked before volume testing: `runtime-rs + Firecracker` on the current `kata-deploy 3.27.0` worker image does not reach a working empty pod.
- This lines up with upstream Kata status:
  - `runtime-rs + Firecracker` exists, but Kubernetes stability/integration is still marked uncertain in issue `#8702`
  - the official block-volume how-to is explicitly limited to `runtime-rs` with the default hypervisor `Dragonball`, not Firecracker
- Current implication:
  - Phase 1 did **not** prove filesystem volumes on Firecracker
  - it proved a stronger blocker first: the current `runtime-rs + Firecracker` path is not viable enough on this package to serve as the next storage experiment base

## Immediate next step

1. Clean up the temporary `kata-fc-rs` handler and pods from the cluster.
2. Re-audit what direct-volume tooling actually exists in the current package.
3. If direct-volume tooling is absent or Dragonball-only, treat Phase 2 as blocked on packaging support and move to the fallback Firecracker-only path:
   - guest-side `EFS/NFS` mount from inside the VM

## Execution update (2026-04-16)

We are explicitly changing the active implementation path now:

- We are **not** dropping the historical `runtime-rs` / direct-volume investigation from this document.
- But based on the live spike results, we are **not** treating it as the immediate implementation path anymore.
- The immediate path is now:
  - keep the current working Golang `kata-fc` runtime
  - skip Kubernetes `PVC -> volumeMount -> guest` for workspace persistence
  - mount `EFS/NFS` directly **inside the Firecracker guest**

Why this decision was made:

- `runtime-rs + Firecracker` did not reach a working empty pod on the current node package.
- The direct-volume path does not look ready on the current package either:
  - no `kata-ctl`
  - no obvious `csi-kata-directvolume` tooling on the node
  - upstream direct-volume guidance is currently oriented around `runtime-rs + Dragonball`, not the current Firecracker stack
- The current Golang `kata-fc` path **does** already run real workloads successfully.
- A guest-side network mount avoids the exact broken layer we already proved:
  - host-side filesystem mount
  - then Kata trying to propagate it into the guest

## Phase 4: Active path — Firecracker + guest-side EFS mount

### Why

This is now the most pragmatic Firecracker-only path still available on the current cluster.

Instead of:

- `EFS -> PVC -> host mount -> kata-fc guest mount`

we do:

- `EFS -> mount directly from inside the guest`

That removes the broken host-to-guest filesystem sharing step entirely.

### What to do

1. Start a plain working `kata-fc` sandbox with no workspace `PVC`.
2. Verify what mount tooling is available inside the guest:
   - `mount`
   - `mount.nfs`
   - package manager availability
3. Verify the guest can resolve and reach the EFS endpoint:
   - `fs-<id>.efs.<region>.amazonaws.com`
4. From inside the guest, mount EFS into `/home/user/workspace`.
5. Write a file into the mounted directory.
6. Kill the physical sandbox.
7. Start a new physical sandbox and mount the same EFS path again.
8. Verify the file is still there.

### If the spike works

Then the product direction becomes:

- workspace persistence is implemented by guest-side network mount
- `relay` / OpenSandbox no longer need to provision workspace `PVC`s for the Firecracker path
- recreate semantics stay the same
- only the workspace bootstrap changes

### Tradeoffs

This is not the “most Kubernetes-native” storage path.

It means:

- storage lifecycle is managed more by sandbox bootstrap/runtime code
- and less by Kubernetes storage abstractions

But that is still a valid design for a VM-based sandbox runtime when the default Kubernetes volume propagation path does not work.

So the honest position is:

- it is **not** the cleanest default K8s pattern
- but it is also **not** a hack by definition
- it is a legitimate workaround when the isolation/runtime layer breaks ordinary `PVC -> volumeMount` semantics
- and for a Firecracker-first system it may end up being the most stable option on the current stack

## Architecture update (2026-04-16)

We are changing the active target again based on the Firecracker-specific storage findings.

Historical context kept for reference:

- Phase 1 (`runtime-rs + Firecracker`) is still documented above and remains useful as a failed spike result.
- Phase 4 (`guest-side EFS/NFS mount`) is also still documented above and remains useful as a failed spike result.

But the active implementation target is now:

- keep the current working Golang `kata-fc` runtime path
- stop trying to use shared filesystem semantics as the main persistence path
- stop treating `EFS/PVC -> mountPath` as the desired architecture
- move to a simpler Firecracker-native model:
  - one sandbox = one writable block disk
  - mount only `/home/user/workspace`
  - keep runtime/rootfs immutable

Why this is now the preferred direction:

- Firecracker itself officially supports block devices well.
- We already proved on the live cluster that `kata-fc` can persist data across recreate when the workspace is exposed as a raw block device.
- The remaining work is now product integration, not low-level Firecracker storage discovery.

## Phase 6: Active implementation — block PVC + guest mount

This is the current implementation path.

### Target shape

- Keep the current working Golang `kata-fc` runtime.
- Keep the current OpenSandbox server fork with additive `devicePath` support.
- Use one Kubernetes PVC per logical sandbox:
  - `storageClassName = opensandbox-ebs-gp3`
  - `volumeMode = Block`
- Attach that PVC to the sandbox as:
  - `devicePath = /dev/workspace-disk`
- Inside the guest, mount that device to:
  - `/home/user/workspace`

### Why this is the right next step

- It uses the Firecracker storage mode that we already proved works: block device attachment.
- It avoids the broken filesystem `volumeMount` path.
- It keeps the OpenSandbox fork small:
  - server only attaches the block device
  - runtime is responsible for mounting the workspace

### Concrete implementation steps

1. Update standalone relay PVC provisioning:
   - change the default storage class from `opensandbox-efs` to `opensandbox-ebs-gp3`
   - request `volumeMode: Block`
   - switch from filesystem semantics (`ReadWriteMany`, `mountPath`) to block semantics (`ReadWriteOnce`, `devicePath`)
   - stop waiting for PVC `Bound`, because the EBS storage class uses `WaitForFirstConsumer`
2. Update OpenSandbox relay create path:
   - send `devicePath = /dev/workspace-disk`
   - stop sending `mountPath = /home/user/workspace`
3. Update `agent-runtime` startup:
   - on boot, if `/dev/workspace-disk` exists:
     - create `/home/user/workspace`
     - if the disk is unformatted, run `mkfs.ext4`
     - mount it on `/home/user/workspace`
   - then continue the existing runtime startup unchanged
4. Ensure the runtime image has the needed tooling:
   - `mkfs.ext4`
   - block filesystem inspection / mount tooling

### Immediate validation after implementation

1. Build a new runtime image.
2. Launch one standalone OpenSandbox sandbox with the new block PVC path.
3. Confirm inside the guest:
   - `/dev/workspace-disk` exists
   - `/home/user/workspace` is mounted from that disk
4. Write a file into `/home/user/workspace`.
5. Kill the physical sandbox and recreate it with the same logical sandbox id.
6. Verify the file still exists.
- Firecracker host/shared filesystem support does not look like a mature first-class path.
- Our live experiments match that:
  - `PVC/hostPath -> kata-fc guest` did not give us real persistent filesystem semantics
  - `guest-side EFS/NFS` is blocked by shipped guest kernels not having NFS support
- The E2B architecture points in the same direction:
  - immutable base rootfs
  - separate writable disk
  - guest-level filesystem assembly

## Phase 5: Active path — current kata-fc + writable block disk for workspace

### Goal

Get persistence for `/home/user/workspace` without changing the working Firecracker runtime path.

This is intentionally simpler than the full E2B overlay design:

- do **not** build full root overlayfs first
- do **not** make the whole guest root writable
- do **not** optimize for disk deduplication first

Instead:

- attach one persistent block disk to the sandbox
- use it only for `/home/user/workspace`

### Desired behavior

1. Sandbox starts on the current working `kata-fc` path.
2. A writable block disk is attached to the VM.
3. Inside the guest, that disk is formatted/mounted as `/home/user/workspace`.
4. The sandbox writes files there.
5. Physical sandbox dies.
6. New physical sandbox reattaches the same disk.
7. Files are still present.

### Why this is simpler than full overlayfs

The E2B overlayfs architecture is useful and relevant, but it solves additional problems too:

- root filesystem writeability
- copy-on-write layering
- base image disk savings

Our immediate product problem is narrower:

- preserve workspace files across recreate / TTL

So the first implementation target should be only:

- persistent block disk mounted at `/home/user/workspace`

If that works, we can later decide whether a broader overlayfs design is even necessary.

### What to do

1. Check what block-volume support already exists in the cluster:
   - EBS CSI driver / controller presence
   - existing `StorageClass` objects
   - whether `volumeMode: Block` can be provisioned
2. Build a plain Kubernetes smoke test on the current working `kata-fc` path:
   - one PVC backed by block storage
   - `volumeMode: Block`
   - pod uses `volumeDevices`, not `volumeMounts`
3. Inside the guest:
   - verify a real block device appears
   - create filesystem if needed
   - mount it to `/home/user/workspace`
   - write a file
4. Recreate the pod with the same PVC and verify the file survives.

### Integration implications if the smoke works

If the smoke works, the product path becomes:

- `sandboxId -> persistent block volume`
- OpenSandbox must attach a raw block device, not just a filesystem volumeMount
- relay/OpenSandbox recreate semantics remain the same
- runtime startup mounts the attached disk into `/home/user/workspace`

### Open question

The largest remaining unknown is not Firecracker itself, but whether the current
`OpenSandbox -> BatchSandbox -> Kubernetes` path can express raw block volumes
(`volumeDevices`) cleanly, or whether that part will need extension.

## Phase 5 findings (2026-04-16)

The simplified Firecracker-native block-disk path is now the first storage path
that has actually worked end-to-end on the current working Golang `kata-fc`
runtime.

What was required before the test:

- add the EBS CSI addon to the cluster
- add a CSI-based `gp3` `StorageClass`

What was tested:

1. Create a `PersistentVolumeClaim` with:
   - `storageClassName: opensandbox-ebs-gp3`
   - `volumeMode: Block`
2. Start a plain `kata-fc` pod using:
   - `volumeDevices`
   - device path `/dev/workspace-disk`
3. Inside the guest:
   - verify the block device exists
   - create an ext4 filesystem
   - mount it at `/home/user/workspace`
   - write `persist.txt`
4. Delete the physical pod.
5. Recreate a new physical pod with the same PVC.
6. Mount the same device again and read `persist.txt`.

Observed result:

- Kubernetes successfully provisioned and attached the block volume.
- The `kata-fc` guest saw a real block device:
  - `/dev/workspace-disk`
- The block device could be formatted and mounted inside the guest.
- A file written to `/home/user/workspace/persist.txt` survived pod deletion and recreation.

This is the strongest confirmed result of the storage investigation so far:

- current working `kata-fc` **can** use persistent storage
- but the viable path is **raw block device attached to the VM**
- not ordinary filesystem `PVC -> volumeMount`

## New immediate next step

Stop spending time on Firecracker filesystem-sharing paths for the current stack.

The next implementation target should be:

1. teach the sandbox path to attach one raw block volume per logical sandbox
2. mount it inside the guest at `/home/user/workspace`
3. keep runtime/rootfs immutable
4. re-test TTL/recreate and Claude state on top of that
