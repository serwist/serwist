import type { Reroute } from "@sveltejs/kit";
import { REROUTE } from "$lib/constants";

export const reroute: Reroute = ({ url }) => {
  if (url.pathname in REROUTE) {
    return REROUTE[url.pathname];
  }
};
