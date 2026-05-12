// Source code: https://github.com/rayepps/radash/blob/03dd3152f560414e933cedcd3bda3c6db3e8306b/src/async.ts#L112-L147
// License: MIT
// Author: rayepps
interface ItemResult<K> {
  index: number;
  result: K;
}

/**
 * Executes many async functions in parallel. Returns the
 * results from all functions as an array. Does not handle
 * any error.
 */
export const parallel = async <T, K>(limit: number, array: readonly T[], func: (item: T) => Promise<K>): Promise<K[]> => {
  const work = array.map((item, index) => ({
    index,
    item,
  }));
  // Process array items
  const processor = async (res: (value: ItemResult<K>[]) => void) => {
    const results: ItemResult<K>[] = [];
    while (true) {
      const next = work.pop();
      if (!next) {
        return res(results);
      }
      const result = await func(next.item);
      results.push({
        result: result,
        index: next.index,
      });
    }
  };
  // Create queues
  const queues = Array.from({ length: limit }, () => new Promise(processor));
  // Wait for all queues to complete
  const results = (await Promise.all(queues))
    .flat()
    .sort((a, b) => (a.index < b.index ? -1 : 1))
    .map((res) => res.result);
  return results;
};
