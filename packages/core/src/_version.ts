try {
  // @ts-expect-error God knows what these mfs are trying to do
  self["workbox:core:7.0.0"] && _();
} catch (e) {
  // Do nothing
}
