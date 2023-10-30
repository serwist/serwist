try {
  // @ts-expect-error God knows
  self["workbox:broadcast-update:7.0.0"] && _();
} catch (e) {
  // Do nothing
}
