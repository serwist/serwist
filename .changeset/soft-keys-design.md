---
"@serwist/next": major
---

chore(next): changed `defaultCache`'s `"next-data"`'s handler to NetworkFirst

- Using `StaleWhileRevalidate` seems to affect `getServerSideProps`. See https://github.com/serwist/serwist/issues/74 for more details.

- There's nothing to be done on your side.