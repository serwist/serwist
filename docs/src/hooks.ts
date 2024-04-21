import { REROUTE } from "$lib/constants";
import type { Reroute } from "@sveltejs/kit";

export const reroute: Reroute = ({ url }) => {
  if (url.pathname in REROUTE) {
    return REROUTE[url.pathname];
  }
};
