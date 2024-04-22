export const isCurrentPageOutOfScope = (scope: string) => {
  const scopeURL = new URL(scope, document.baseURI);
  const scopeURLBasePath = new URL("./", scopeURL.href).pathname;
  return !location.pathname.startsWith(scopeURLBasePath);
};
