// Source code: https://github.com/rayepps/radash/blob/03dd3152f560414e933cedcd3bda3c6db3e8306b/src/async.ts#L112-L147
// License: MIT
// Author: rayepps
interface ItemResult<K> {
  index: number;
  result: K;
}

/**
 * Executes many async functions in parallel. Returns the
 * results from all functions in input order, or rejects if
 * any function throws or rejects.
 */
export const parallel = async <T, K>(limit: number, array: readonly T[], func: (item: T) => Promise<K>): Promise<K[]> => {
  const work = array.map((item, index) => ({
    index,
    item,
  }));
  // Process array items
  const processor = async () => {
    const results: ItemResult<K>[] = [];
    while (true) {
      const next = work.pop();
      if (!next) {
        return results;
      }
      const result = await func(next.item);
      results.push({
        result,
        index: next.index,
      });
    }
  };
  const results = new Array(work.length);
  for (const queue of await Promise.all(Array.from({ length: limit }, processor))) {
    for (const item of queue) {
      results[item.index] = item.result;
    }
  }
  return results;
};
