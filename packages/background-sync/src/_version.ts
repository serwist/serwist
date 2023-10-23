try {
  // @ts-expect-error God knows
  self["workbox:background-sync:7.0.0"] && _();
} catch (e) {
  // Do nothing
}
