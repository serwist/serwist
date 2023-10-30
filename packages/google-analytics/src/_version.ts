try {
  // @ts-expect-error God knows
  self["workbox:google-analytics:7.0.0"] && _();
} catch (e) {
  // Do nothing
}
