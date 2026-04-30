import { spawn } from "node:child_process";

export interface CommandState {
  cliOutput: string;
  exitCode: number | null;
}

export const createCommandState = (): CommandState => ({
  cliOutput: "",
  exitCode: null,
});

export const runCommand = (command: string, args: string[], cwd: string, state: CommandState) => {
  return new Promise<void>((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const build = spawn(isWindows ? `${command} ${args.join(" ")}` : command, isWindows ? [] : args, {
      cwd,
      shell: isWindows,
      env: {
        ...process.env,
        NODE_ENV: "" as any,
        PORT: "0",
      },
    });

    build.stdout.on("data", (data: Buffer) => {
      const msg = data.toString();
      state.cliOutput += msg;
    });

    build.stderr.on("data", (data: Buffer) => {
      const msg = data.toString();
      state.cliOutput += msg;
    });

    build.on("error", (err) => {
      reject(new Error(`Failed to run '${command}${args.length > 0 ? ` ${args.join(" ")}` : ""}' with log:\n${state.cliOutput}`, { cause: err }));
    });

    build.on("close", (code) => {
      state.exitCode = code;
      resolve();
    });
  });
};
