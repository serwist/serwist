---
"@serwist/build": patch
---

fix(build): fixed CommonJS build crashing (again)

- It is `stringify-object` this time.
- A test has been added to help avoid this issue.
