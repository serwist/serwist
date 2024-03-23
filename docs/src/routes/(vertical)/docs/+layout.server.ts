import type { LayoutServerLoad } from "./$types";
import { DOCS_SIDEBAR_LINKS } from "./$layout.constants";

export const load: LayoutServerLoad = () => ({
  sidebar: DOCS_SIDEBAR_LINKS,
});
