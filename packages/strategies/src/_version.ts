try {
  // @ts-expect-error God knows
  self["workbox:strategies:7.0.0"] && _();
} catch (e) {
  // Do nothing
}
