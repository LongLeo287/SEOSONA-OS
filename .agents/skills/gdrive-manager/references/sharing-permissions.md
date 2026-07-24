# Sharing & Permissions Reference

## Share with a specific user
```python
def share_file(file_id, email, role="reader", notify=True):
    """
    role: 'reader', 'commenter', 'writer', 'fileOrganizer', 'organizer', 'owner'
    type: 'user', 'group', 'domain', 'anyone'
    """
    perm = drive.permissions().create(
        fileId=file_id,
        sendNotificationEmail=notify,
        body={"role": role, "type": "user", "emailAddress": email},
        fields="id"
    ).execute()
    return perm
```

## Make file public (anyone with link can view)
```python
def make_public(file_id):
    drive.permissions().create(
        fileId=file_id,
        body={"role": "reader", "type": "anyone"}
    ).execute()
    # Return shareable link
    return drive.files().get(fileId=file_id, fields="webViewLink").execute()["webViewLink"]
```

## List current permissions
```python
def list_permissions(file_id):
    perms = drive.permissions().list(
        fileId=file_id,
        fields="permissions(id,emailAddress,role,type,displayName)"
    ).execute()
    return perms.get("permissions", [])
```

## Revoke permission
```python
def revoke_permission(file_id, permission_id):
    drive.permissions().delete(fileId=file_id, permissionId=permission_id).execute()
```

## Transfer ownership
```python
def transfer_ownership(file_id, new_owner_email):
    drive.permissions().create(
        fileId=file_id,
        transferOwnership=True,
        body={"role": "owner", "type": "user", "emailAddress": new_owner_email}
    ).execute()
```

## Roles Reference
| Role | Can View | Can Comment | Can Edit | Can Manage |
|------|----------|-------------|----------|------------|
| `reader` | ✅ | ❌ | ❌ | ❌ |
| `commenter` | ✅ | ✅ | ❌ | ❌ |
| `writer` | ✅ | ✅ | ✅ | ❌ |
| `fileOrganizer` | ✅ | ✅ | ✅ | Partial |
| `organizer` | ✅ | ✅ | ✅ | ✅ |
| `owner` | ✅ | ✅ | ✅ | ✅ |
