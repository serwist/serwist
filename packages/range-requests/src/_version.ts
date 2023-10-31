try {
  // @ts-expect-error God knows
  self["workbox:range-requests:7.0.0"] && _();
} catch (e) {
  // Do nothing
}
