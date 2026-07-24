# File CRUD — Extended Patterns

## Google Docs

### Insert text at end
```python
def append_to_doc(doc_id, text):
    doc = docs.documents().get(documentId=doc_id).execute()
    end_index = doc["body"]["content"][-1]["endIndex"] - 1
    requests = [{"insertText": {"location": {"index": end_index}, "text": text}}]
    docs.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()
```

### Replace text (find & replace)
```python
def replace_in_doc(doc_id, find, replace):
    requests = [{"replaceAllText": {
        "containsText": {"text": find, "matchCase": False},
        "replaceText": replace
    }}]
    docs.documents().batchUpdate(documentId=doc_id, body={"requests": requests}).execute()
```

### Extract plain text from Doc
```python
def extract_doc_text(doc_id):
    doc = docs.documents().get(documentId=doc_id).execute()
    lines = []
    for block in doc.get("body", {}).get("content", []):
        for elem in block.get("paragraph", {}).get("elements", []):
            lines.append(elem.get("textRun", {}).get("content", ""))
    return "".join(lines)
```

---

## Google Sheets

### Read a range
```python
def read_range(spreadsheet_id, range_name="Sheet1"):
    result = sheets.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range=range_name
    ).execute()
    return result.get("values", [])
```

### Write to a range
```python
def write_range(spreadsheet_id, range_name, values):
    sheets.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id, range=range_name,
        valueInputOption="USER_ENTERED",
        body={"values": values}
    ).execute()
```

### Append rows
```python
def append_rows(spreadsheet_id, sheet_name, rows):
    sheets.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range=f"{sheet_name}!A1",
        valueInputOption="USER_ENTERED",
        body={"values": rows}
    ).execute()
```

### Read as list of dicts (header row as keys)
```python
def read_as_dicts(spreadsheet_id, range_name="Sheet1"):
    rows = read_range(spreadsheet_id, range_name)
    if not rows: return []
    headers = rows[0]
    return [dict(zip(headers, row)) for row in rows[1:]]
```

---

## Google Slides

### Add a new slide
```python
def add_slide(presentation_id, layout="BLANK"):
    requests = [{"createSlide": {
        "insertionIndex": 999,
        "slideLayoutReference": {"predefinedLayout": layout}
    }}]
    slides.presentations().batchUpdate(
        presentationId=presentation_id, body={"requests": requests}
    ).execute()
```

### Add text box to slide
```python
def add_text_to_slide(presentation_id, slide_id, text, x=100, y=100, w=400, h=100):
    box_id = f"box_{slide_id}"
    requests = [
        {"createShape": {"objectId": box_id, "shapeType": "TEXT_BOX",
            "elementProperties": {"pageObjectId": slide_id,
                "size": {"width": {"magnitude": w, "unit": "PT"},
                         "height": {"magnitude": h, "unit": "PT"}},
                "transform": {"scaleX": 1, "scaleY": 1,
                               "translateX": x, "translateY": y, "unit": "PT"}}}},
        {"insertText": {"objectId": box_id, "text": text}}
    ]
    slides.presentations().batchUpdate(
        presentationId=presentation_id, body={"requests": requests}
    ).execute()
```

### Get all slide IDs
```python
def get_slide_ids(presentation_id):
    prs = slides.presentations().get(presentationId=presentation_id).execute()
    return [s["objectId"] for s in prs.get("slides", [])]
```

---

## Drive File Metadata

### Get full metadata for a file
```python
def get_file_meta(file_id):
    return drive.files().get(
        fileId=file_id,
        fields="id,name,mimeType,size,modifiedTime,createdTime,owners,parents,webViewLink,starred,trashed"
    ).execute()
```

### Copy a file
```python
def copy_file(file_id, new_name, parent_id=None):
    meta = {"name": new_name}
    if parent_id: meta["parents"] = [parent_id]
    return drive.files().copy(fileId=file_id, body=meta, fields="id,name,webViewLink").execute()
```

### Batch delete (trash)
```python
def batch_trash(file_ids):
    results = []
    for fid in file_ids:
        r = drive.files().update(fileId=fid, body={"trashed": True}, fields="id,name").execute()
        results.append(r)
    return results
```
