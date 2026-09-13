import { parallel } from "@serwist/utils";
import { describe, expect, test } from "vitest";

describe("@serwist/utils - parallel", () => {
  test("returns results in input order without exceeding the concurrency limit", async () => {
    let active = 0;
    let maxActive = 0;

    const results = await parallel(2, [1, 2, 3, 4], async (item) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await Promise.resolve();
      active--;
      return item * 2;
    });

    expect(results).toEqual([2, 4, 6, 8]);
    expect(maxActive).toBe(2);
    expect(active).toBe(0);
  });

  test("returns an empty array without calling the callback for empty input", async () => {
    const results = await parallel(2, [], () => {
      throw new Error("The callback should not run");
    });

    expect(results).toEqual([]);
  });

  test("rejects with the original error when a callback rejects", async () => {
    const error = new Error("Download failed");

    await expect(parallel(2, [1, 2], () => Promise.reject(error))).rejects.toBe(error);
  }, 1000);

  test("rejects with the original error when a callback throws synchronously", async () => {
    const error = new Error("Download failed");

    await expect(
      parallel(2, [1, 2], () => {
        throw error;
      }),
    ).rejects.toBe(error);
  }, 1000);
});
