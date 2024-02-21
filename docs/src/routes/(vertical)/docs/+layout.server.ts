import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => ({
  gitBranch: locals.currentBranch,
});
