import { type ChildProcessWithoutNullStreams, exec, spawn } from "node:child_process";

type Callback = (error?: Error) => void;

export default (pid: number, signal?: string | number, callback?: Callback) => {
  if (typeof signal === "function" && callback === undefined) {
    callback = signal;
    signal = undefined;
  }

  if (Number.isNaN(pid)) {
    if (callback) {
      return callback(new Error("pid must be a number"));
    }
    throw new Error("pid must be a number");
  }

  const tree = new Map<number, number[]>([[pid, []]]);
  const pidsToProcess = new Set<number>([pid]);

  switch (process.platform) {
    case "win32":
      exec(`taskkill /pid ${pid} /T /F`, (err) => callback?.(err ?? undefined));
      break;
    case "darwin":
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        (parentPid) => spawn("pgrep", ["-P", `${parentPid}`]),
        () => void killAll(tree, signal, callback),
      );
      break;
    default: // Linux
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        (parentPid) => spawn("ps", ["-o", "pid", "--no-headers", "--ppid", `${parentPid}`]),
        () => void killAll(tree, signal, callback),
      );
      break;
  }
};

function killAll(tree: Map<number, number[]>, signal: string | number | undefined, callback: Callback | undefined) {
  const killed: Record<number, boolean> = {};
  try {
    tree.forEach((tree_pid) => {
      for (const pidpid of tree_pid) {
        if (!killed[pidpid]) {
          killPid(pidpid, signal);
          killed[pidpid] = true;
        }
      }
    });
  } catch (err) {
    if (callback) {
      return callback(err as Error | undefined);
    }
    throw err;
  }
  if (callback) {
    return callback();
  }
}

function killPid(pid: number, signal: string | number | undefined) {
  try {
    process.kill(pid, signal);
  } catch (err) {
    if ((err as any).code !== "ESRCH") {
      throw err;
    }
  }
}

function buildProcessTree(
  parentPid: number,
  tree: Map<number, number[]>,
  pidsToProcess: Set<number>,
  spawnChildProcessesList: (parentPid: number) => ChildProcessWithoutNullStreams,
  cb: Callback | undefined,
) {
  const ps = spawnChildProcessesList(parentPid);
  let allData = "";
  ps.stdout.on("data", (data: Buffer) => {
    allData += data.toString("ascii");
  });

  const onClose = (code: number | null) => {
    pidsToProcess.delete(parentPid);

    if (code !== null && code !== 0) {
      // no more parent processes
      if (pidsToProcess.size === 0) {
        cb?.(undefined);
      }
      return;
    }

    const matches = allData.match(/\d+/g);

    if (matches) {
      for (const pidMatch of matches) {
        const pid = Number.parseInt(pidMatch, 10);
        tree.get(parentPid)?.push(pid);
        tree.set(pid, []);
        pidsToProcess.add(pid);
        buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
      }
    }
  };

  ps.on("close", onClose);
}
