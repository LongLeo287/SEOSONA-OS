# Drive Query Language Reference

Full reference: https://developers.google.com/drive/api/guides/search-files

## Operators

| Operator | Usage |
|----------|-------|
| `=`, `!=`       | Equality |
| `<`, `<=`, `>`, `>=` | Comparisons (dates, sizes) |
| `in`            | Value is in a collection |
| `contains`      | String/collection contains value |
| `and`, `or`, `not` | Boolean logic |

## Key Query Fields

| Field | Example |
|-------|---------|
| `name = 'Budget'` | Exact name match |
| `name contains 'report'` | Partial name match |
| `mimeType = '...'` | Filter by type |
| `'folderId' in parents` | Files inside a folder |
| `trashed = false` | Exclude trashed |
| `starred = true` | Only starred |
| `modifiedTime > '2024-01-01T00:00:00'` | Modified after date |
| `createdTime < '2024-06-01T00:00:00'` | Created before date |
| `fullText contains 'keyword'` | Content search |
| `owners in ['user@example.com']` | Owned by user |
| `sharedWithMe = true` | Shared with me |
| `visibility = 'anyoneCanFind'` | Public files |

## Common Query Recipes

```python
# All folders in root
q = "'root' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"

# All PDFs shared with me
q = "mimeType='application/pdf' and sharedWithMe=true and trashed=false"

# Modified in last 7 days
q = "modifiedTime > '2024-01-01T00:00:00' and trashed=false"

# Starred Sheets
q = "mimeType='application/vnd.google-apps.spreadsheet' and starred=true"

# Any file containing the word 'invoice'
q = "fullText contains 'invoice' and trashed=false"

# Files NOT in any folder (orphans)
q = "'root' in parents and trashed=false"
```

## Pagination

```python
def list_all(q, fields="files(id,name,mimeType,modifiedTime)"):
    results, page_token = [], None
    while True:
        resp = drive.files().list(q=q, fields=f"nextPageToken,{fields}",
                                   pageToken=page_token, pageSize=100).execute()
        results.extend(resp.get("files", []))
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return results
```
