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
    const build = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
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

    build.stderr.on("error", (err) => {
      reject(err);
    });

    build.on("close", (code) => {
      state.exitCode = code;
      resolve();
    });
  });
};
