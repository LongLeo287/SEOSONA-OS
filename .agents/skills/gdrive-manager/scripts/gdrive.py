#!/usr/bin/env python3
"""
gdrive.py — Unified Google Drive CLI for AI Agents & Humans.

Usage:
  python scripts/gdrive.py <command> [options]

Commands:
  --- Read/List ---
  list                     List files/folders (root by default)
  info     --id FILE_ID    Get metadata for a file/folder
  search   --name QUERY    Search by name
  search   --text QUERY    Full-text search inside files
  search   --type TYPE     Search by type (doc|sheet|slide|folder|pdf)

  --- Create ---
  mkdir    --name NAME     Create a folder
  mkdoc    --name NAME     Create a Google Doc
  mksheet  --name NAME     Create a Google Sheet
  mkslide  --name NAME     Create a Google Slides presentation

  --- Update ---
  rename   --id ID --name NEW_NAME
  move     --id ID --to FOLDER_ID

  --- Upload / Download ---
  upload   --src PATH [--to FOLDER_ID] [--convert]
  download --id FILE_ID [--dest DIR]

  --- Permissions ---
  share    --id ID --email EMAIL [--role reader|writer|commenter]
  public   --id ID

  ⚠️  DESTRUCTIVE (require human confirmation — AI CANNOT BYPASS) ---
  trash    --id ID [--id ID ...]    Move to Trash (recoverable 30 days)
  delete   --id ID [--id ID ...]    PERMANENT delete (IRREVERSIBLE)

  --- Audit ---
  audit                    View recent destructive operation log

Global flags:
  --out markdown|json      Output format (default: markdown)
  --parent FOLDER_ID       Parent folder for create/upload
  --confirm                Allow non-interactive trash (NOT for permanent delete)
"""

import argparse
import json
import os
import sys
import mimetypes

# Ensure scripts/ directory is in path so safety.py can be imported as a sibling
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# ─── Auth ─────────────────────────────────────────────────────────────────────

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/presentations",
]
CREDS_FILE = os.environ.get("GDRIVE_CREDS", "credentials.json")
TOKEN_FILE  = os.environ.get("GDRIVE_TOKEN", "token.json")


def get_credentials():
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDS_FILE):
                print(f"[ERROR] credentials.json not found. Run: python scripts/auth_setup.py")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return creds


def build(name, version):
    from googleapiclient.discovery import build as _build
    return _build(name, version, credentials=get_credentials())


# ─── Services (lazy) ─────────────────────────────────────────────────────────

_drive = _docs = _sheets = _slides = None

def drive():
    global _drive
    if not _drive: _drive = build("drive", "v3")
    return _drive

def docs():
    global _docs
    if not _docs: _docs = build("docs", "v1")
    return _docs

def sheets():
    global _sheets
    if not _sheets: _sheets = build("sheets", "v4")
    return _sheets

def slides():
    global _slides
    if not _slides: _slides = build("slides", "v1")
    return _slides


# ─── Output Formatters ───────────────────────────────────────────────────────

def fmt_size(b):
    try:
        b = int(b)
        for u in ["B","KB","MB","GB"]:
            if b < 1024: return f"{b:.1f} {u}"
            b /= 1024
        return f"{b:.1f} TB"
    except: return "—"

def fmt_time(iso):
    if not iso: return "—"
    return iso[:16].replace("T", " ")

def mime_label(mime):
    return (mime or "").split(".")[-1].replace("google-apps.","")

def output(data, fmt="markdown"):
    if fmt == "json":
        print(json.dumps(data, indent=2, default=str))
        return

    # Markdown table for list of files
    if isinstance(data, list):
        if not data:
            print("_No results found._")
            return
        print("| Name | Type | Modified | Size | Link |")
        print("|------|------|----------|------|------|")
        for f in data:
            name  = f.get("name","—")
            mime  = mime_label(f.get("mimeType",""))
            mtime = fmt_time(f.get("modifiedTime",""))
            size  = fmt_size(f.get("size","")) if f.get("size") else "—"
            link  = f.get("webViewLink","")
            link_md = f"[open]({link})" if link else "—"
            print(f"| {name} | {mime} | {mtime} | {size} | {link_md} |")
    elif isinstance(data, dict):
        print("| Field | Value |")
        print("|-------|-------|")
        for k, v in data.items():
            print(f"| {k} | {v} |")
    else:
        print(data)


# ─── Operations ───────────────────────────────────────────────────────────────

FILE_FIELDS = "id,name,mimeType,modifiedTime,createdTime,size,webViewLink,parents,owners,trashed"
LIST_FIELDS = f"files({FILE_FIELDS})"

MIME_TYPES = {
    "doc":    "application/vnd.google-apps.document",
    "sheet":  "application/vnd.google-apps.spreadsheet",
    "slide":  "application/vnd.google-apps.presentation",
    "folder": "application/vnd.google-apps.folder",
    "pdf":    "application/pdf",
}

EXPORT_FORMATS = {
    "application/vnd.google-apps.document":
        ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
    "application/vnd.google-apps.spreadsheet":
        ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"),
    "application/vnd.google-apps.presentation":
        ("application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx"),
    "application/vnd.google-apps.drawing": ("image/svg+xml", ".svg"),
}


def cmd_list(args):
    folder_id = args.parent or "root"
    results = drive().files().list(
        q=f"'{folder_id}' in parents and trashed=false",
        fields=LIST_FIELDS, pageSize=100
    ).execute()
    output(results.get("files", []), args.out)


def cmd_info(args):
    f = drive().files().get(fileId=args.id, fields=FILE_FIELDS).execute()
    output(f, args.out)


def cmd_search(args):
    q_parts = ["trashed=false"]
    if args.name:  q_parts.append(f"name contains '{args.name}'")
    if args.text:  q_parts.append(f"fullText contains '{args.text}'")
    if args.type:
        mime = MIME_TYPES.get(args.type)
        if not mime:
            print(f"[ERROR] Unknown type '{args.type}'. Use: {', '.join(MIME_TYPES)}")
            sys.exit(1)
        q_parts.append(f"mimeType='{mime}'")
    if args.parent:
        q_parts.append(f"'{args.parent}' in parents")
    results = drive().files().list(
        q=" and ".join(q_parts), fields=LIST_FIELDS, pageSize=50
    ).execute()
    output(results.get("files", []), args.out)


def cmd_mkdir(args):
    meta = {"name": args.name, "mimeType": "application/vnd.google-apps.folder"}
    if args.parent: meta["parents"] = [args.parent]
    f = drive().files().create(body=meta, fields=FILE_FIELDS).execute()
    print(f"[OK] Folder created: {f['name']} (id: {f['id']})")
    output([f], args.out)


def cmd_mkdoc(args):
    if args.command == "mkdoc":
        f = docs().documents().create(body={"title": args.name}).execute()
        fid = f["documentId"]
    elif args.command == "mksheet":
        f = sheets().spreadsheets().create(
            body={"properties": {"title": args.name}}).execute()
        fid = f["spreadsheetId"]
    elif args.command == "mkslide":
        f = slides().presentations().create(body={"title": args.name}).execute()
        fid = f["presentationId"]
    else:
        return
    if args.parent:
        drive().files().update(
            fileId=fid, addParents=args.parent, fields="id,parents"
        ).execute()
    meta = drive().files().get(fileId=fid, fields=FILE_FIELDS).execute()
    print(f"[OK] Created: {meta['name']} (id: {fid})")
    output([meta], args.out)


def cmd_rename(args):
    f = drive().files().update(
        fileId=args.id, body={"name": args.name}, fields=FILE_FIELDS
    ).execute()
    print(f"[OK] Renamed to: {f['name']}")
    output([f], args.out)


def cmd_move(args):
    current = drive().files().get(fileId=args.id, fields="parents").execute()
    old_parents = ",".join(current.get("parents", []))
    f = drive().files().update(
        fileId=args.id, addParents=args.to, removeParents=old_parents,
        fields=FILE_FIELDS
    ).execute()
    print(f"[OK] Moved: {f['name']} → folder {args.to}")
    output([f], args.out)


def cmd_upload(args):
    from googleapiclient.http import MediaFileUpload
    src = args.src
    if not src:
        print("[ERROR] --src is required for upload")
        sys.exit(1)
    if not os.path.exists(src):
        print(f"[ERROR] Path not found: {src}")
        sys.exit(1)
    # Accept --to or --parent interchangeably for upload destination
    parent = args.to or args.parent or None
    if os.path.isdir(src):
        _upload_folder(src, parent, args.convert)
    else:
        _upload_file(src, parent, args.convert)


def _upload_file(local_path, parent_id=None, convert=False):
    from googleapiclient.http import MediaFileUpload
    CONVERT_MIME = {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "application/vnd.google-apps.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            "application/vnd.google-apps.spreadsheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            "application/vnd.google-apps.presentation",
    }
    src_mime, _ = mimetypes.guess_type(local_path)
    src_mime = src_mime or "application/octet-stream"
    meta = {"name": os.path.basename(local_path)}
    if parent_id: meta["parents"] = [parent_id]
    if convert and src_mime in CONVERT_MIME:
        meta["mimeType"] = CONVERT_MIME[src_mime]
    media = MediaFileUpload(local_path, mimetype=src_mime, resumable=True)
    f = drive().files().create(body=meta, media_body=media, fields=FILE_FIELDS).execute()
    print(f"[OK] Uploaded: {f['name']} (id: {f['id']})")
    return f


def _upload_folder(local_dir, parent_id=None, convert=False):
    name = os.path.basename(local_dir)
    meta = {"name": name, "mimeType": "application/vnd.google-apps.folder"}
    if parent_id: meta["parents"] = [parent_id]
    folder = drive().files().create(body=meta, fields="id,name").execute()
    print(f"[OK] Created folder: {folder['name']} (id: {folder['id']})")
    for item in os.listdir(local_dir):
        path = os.path.join(local_dir, item)
        if os.path.isdir(path):
            _upload_folder(path, folder["id"], convert)
        else:
            _upload_file(path, folder["id"], convert)
    return folder


def cmd_download(args):
    from googleapiclient.http import MediaIoBaseDownload
    dest = args.dest or "."
    os.makedirs(dest, exist_ok=True)
    meta = drive().files().get(fileId=args.id, fields="name,mimeType").execute()
    name, mime = meta["name"], meta["mimeType"]

    if mime == "application/vnd.google-apps.folder":
        out = _download_folder(args.id, dest)
        print(f"[OK] Downloaded folder to: {out}")
        return

    export = EXPORT_FORMATS.get(mime)
    if export:
        export_mime, ext = export
        request = drive().files().export_media(fileId=args.id, mimeType=export_mime)
        name += ext
    else:
        request = drive().files().get_media(fileId=args.id)

    out_path = os.path.join(dest, name)
    with open(out_path, "wb") as f:
        dl = MediaIoBaseDownload(f, request)
        done = False
        while not done:
            _, done = dl.next_chunk()
    print(f"[OK] Downloaded: {out_path}")


def _download_folder(folder_id, dest):
    from googleapiclient.http import MediaIoBaseDownload
    meta = drive().files().get(fileId=folder_id, fields="name").execute()
    local_dir = os.path.join(dest, meta["name"])
    os.makedirs(local_dir, exist_ok=True)
    items = drive().files().list(
        q=f"'{folder_id}' in parents and trashed=false",
        fields=LIST_FIELDS
    ).execute().get("files", [])
    for item in items:
        if item["mimeType"] == "application/vnd.google-apps.folder":
            _download_folder(item["id"], local_dir)
        else:
            export = EXPORT_FORMATS.get(item["mimeType"])
            if export:
                export_mime, ext = export
                req = drive().files().export_media(fileId=item["id"], mimeType=export_mime)
                fname = item["name"] + ext
            else:
                req = drive().files().get_media(fileId=item["id"])
                fname = item["name"]
            path = os.path.join(local_dir, fname)
            with open(path, "wb") as f:
                from googleapiclient.http import MediaIoBaseDownload
                dl = MediaIoBaseDownload(f, req)
                done = False
                while not done: _, done = dl.next_chunk()
    return local_dir


def cmd_share(args):
    body = {"role": args.role or "reader", "type": "user", "emailAddress": args.email}
    perm = drive().permissions().create(
        fileId=args.id, body=body, fields="id", sendNotificationEmail=True
    ).execute()
    print(f"[OK] Shared with {args.email} as {args.role or 'reader'} (perm id: {perm['id']})")


def cmd_public(args):
    drive().permissions().create(
        fileId=args.id, body={"role": "reader", "type": "anyone"}, fields="id"
    ).execute()
    link = drive().files().get(fileId=args.id, fields="webViewLink").execute()["webViewLink"]
    print(f"[OK] File is now public: {link}")


# ─── DESTRUCTIVE OPERATIONS — SAFETY ENFORCED ─────────────────────────────────
# These commands ALWAYS route through safety.py.
# NO path in this codebase calls drive().files().delete() or trashed=True
# without first passing through confirm_trash() or confirm_permanent_delete().

def cmd_trash(args):
    """Move items to Trash. Recoverable within 30 days. Requires human confirmation."""
    from safety import confirm_trash

    items = []
    for fid in args.id:
        try:
            meta = drive().files().get(fileId=fid, fields="id,name").execute()
            items.append({"id": meta["id"], "name": meta["name"]})
        except Exception as e:
            print(f"[ERROR] Could not fetch metadata for {fid}: {e}")
            sys.exit(1)

    # ══════════════════════════════════════════════════════════════
    # SAFETY GATE — no confirmation = no action. Period.
    # ══════════════════════════════════════════════════════════════
    confirmed = confirm_trash(items, non_interactive=args.confirm)

    if not confirmed:
        print("[ABORTED] No items were trashed.")
        sys.exit(0)

    for item in items:
        drive().files().update(
            fileId=item["id"], body={"trashed": True}, fields="id"
        ).execute()
        print(f"[TRASHED] {item['name']} (id: {item['id']})")


def cmd_delete(args):
    """
    PERMANENTLY delete items. IRREVERSIBLE. NO RECOVERY POSSIBLE.
    Always requires interactive human confirmation — no env var bypass allowed.
    """
    from safety import confirm_permanent_delete

    items = []
    for fid in args.id:
        try:
            meta = drive().files().get(fileId=fid, fields="id,name").execute()
            items.append({"id": meta["id"], "name": meta["name"]})
        except Exception as e:
            print(f"[ERROR] Could not fetch metadata for {fid}: {e}")
            sys.exit(1)

    # ══════════════════════════════════════════════════════════════════
    # HARD SAFETY GATE — non-interactive is ALWAYS blocked here.
    # This is not configurable. This is not overridable by any argument.
    # ══════════════════════════════════════════════════════════════════
    confirmed = confirm_permanent_delete(items, non_interactive=False)

    if not confirmed:
        print("[ABORTED] No items were deleted.")
        sys.exit(0)

    for item in items:
        drive().files().delete(fileId=item["id"]).execute()
        print(f"[DELETED] {item['name']} (id: {item['id']})")


def cmd_audit(args):
    from safety import view_audit_log
    view_audit_log(last_n=30)


# ─── CLI Entry Point ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Google Drive Manager — AI-safe CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("command", choices=[
        "list","info","search","mkdir","mkdoc","mksheet","mkslide",
        "rename","move","upload","download","share","public",
        "trash","delete","audit"
    ])
    parser.add_argument("--id",     nargs="+", help="File/folder ID(s)")
    parser.add_argument("--name",   help="Name for create/rename/search")
    parser.add_argument("--text",   help="Full-text search query")
    parser.add_argument("--type",   help="File type filter: doc|sheet|slide|folder|pdf")
    parser.add_argument("--parent", help="Parent folder ID (for create/upload)")
    parser.add_argument("--to",     help="Destination folder ID (for move; also accepted for upload)")
    parser.add_argument("--src",    help="Local path for upload")
    parser.add_argument("--dest",   help="Local destination for download (default: .)")
    parser.add_argument("--email",  help="Email for sharing")
    parser.add_argument("--role",   default="reader", help="Share role: reader|writer|commenter")
    parser.add_argument("--convert",action="store_true", help="Convert Office files on upload")
    parser.add_argument("--confirm",action="store_true",
                        help="Allow non-interactive trash (NOT for permanent delete)")
    parser.add_argument("--out",    default="markdown", choices=["markdown","json"],
                        help="Output format (default: markdown)")

    args = parser.parse_args()

    # Single --id convenience: unwrap list when only one expected
    if args.id and len(args.id) == 1 and args.command not in ("trash","delete"):
        args.id = args.id[0]

    dispatch = {
        "list":     cmd_list,
        "info":     cmd_info,
        "search":   cmd_search,
        "mkdir":    cmd_mkdir,
        "mkdoc":    cmd_mkdoc,
        "mksheet":  cmd_mkdoc,
        "mkslide":  cmd_mkdoc,
        "rename":   cmd_rename,
        "move":     cmd_move,
        "upload":   cmd_upload,
        "download": cmd_download,
        "share":    cmd_share,
        "public":   cmd_public,
        "trash":    cmd_trash,
        "delete":   cmd_delete,
        "audit":    cmd_audit,
    }

    try:
        dispatch[args.command](args)
    except KeyboardInterrupt:
        print("\n[CANCELLED]")
        sys.exit(0)
    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
