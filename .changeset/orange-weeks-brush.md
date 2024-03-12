---
"@serwist/build": major
---

refactor(validators): migrate to Zod

- We now use Zod instead of AJV.
- This allows us to further validate the values, as AJV didn't support validating functions, classes, and more.
- Usually, you don't need to do anything. However, if you manipulate the log/error message to do something wicked, you may need to adapt to the new format:

```
Received an invalid Serwist configuration: {
  "_errors": [
    "Received unrecognized keys: someInvalidKey"
  ],
  "additionalPrecacheEntries": {
    "_errors": [
      "Received invalid type: expected array, received string."
    ]
  }
}
```
