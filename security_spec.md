# Security Specification & Test Suite for SAi Firestore Security Rules

## 1. Data Invariants
- A user can only access, create, update, or delete documents inside their own user tree (`/users/{userId}/**`).
- Document IDs must be valid strings (`isValidId`).
- Identity fields (such as `uid` or `userId`) in payloads must match `request.auth.uid`.
- Feedback documents in `/app_feedback/{feedbackId}` can be read by anyone, created by authenticated users matching `userId`, and deleted/updated only by the feedback creator or admin.
- Default deny all unmapped paths.

## 2. Dirty Dozen Payloads (Negative Test Payloads)
1. **Unauthenticated User Profile Access**: Attempting to create `/users/user123` with no auth context.
2. **Identity Spoofing**: User `uid1` attempting to create `/users/uid2` with `uid: "uid2"`.
3. **Cross-User Chat Read**: User `uid1` attempting to read `/users/uid2/chats/chat1`.
4. **Cross-User Voice History Write**: User `uid1` writing to `/users/uid2/voice_history/v1`.
5. **Junk ID Injection**: Writing to `/users/uid1/chats/!@#$%^&*()` exceeding length constraints.
6. **Malicious Oversized Payload**: Attempting to insert a 2MB string into `content` in `/app_feedback/f1`.
7. **Feedback Author Spoofing**: User `uid1` creating a feedback document with `userId: "uid2"`.
8. **Feedback Unauthorized Deletion**: User `uid1` trying to delete feedback created by `uid2`.
9. **Chat Document Overwrite**: User `uid1` trying to overwrite another user's chat session.
10. **Shadow Field Injection**: User attempting to inject `isAdmin: true` into their user profile.
11. **Unauthenticated List Query**: Anonymous user running list query over all `/users`.
12. **System Root Access**: Attempting write access to `/databases/(default)/documents/system_config`.

## 3. Test Runner Definition
All 12 negative test cases return `PERMISSION_DENIED` under `firestore.rules`.
