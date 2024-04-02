import { readPreState } from "@changesets/pre";
import readChangesets from "@changesets/read";
import type { NewChangeset, PreState } from "@changesets/types";

export interface ChangesetState {
  preState: PreState | undefined;
  changesets: NewChangeset[];
  /**
   * Released changesets are removed from the directory, but prereleased
   * ones are not. This list excludes such changesets from `changesets`.
   */
  filteredChangesets: NewChangeset[];
}

export const readChangesetState = async (cwd: string = process.cwd()): Promise<ChangesetState> => {
  const preState = await readPreState(cwd);
  const isInPreMode = preState !== undefined && preState.mode === "pre";
  const changesets = await readChangesets(cwd);

  let changesetsToFilter: Set<string> | null = null;

  return {
    preState: isInPreMode ? preState : undefined,
    changesets,
    filteredChangesets: isInPreMode
      ? // biome-ignore lint/style/noCommaOperator: Just let me write unreadable code like for once
        ((changesetsToFilter = new Set(preState.changesets)), changesets.filter((changeset) => !changesetsToFilter?.has(changeset.id) ?? true))
      : changesets,
  };
};
