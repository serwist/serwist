/**
 * Checks whether the current link is active.
 *
 * @param link
 * @param pathname
 * @returns
 */
export const isLinkActive = (link: string, pathname: string) => {
  if (pathname === "/") {
    return link === "/";
  }
  const pathnameFirstSegment = pathname.slice(0, pathname.indexOf("/", 1));
  return !!pathnameFirstSegment && link.startsWith(pathnameFirstSegment);
};
