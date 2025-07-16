import assert from "node:assert";
import { statSync } from "node:fs";
import path from "node:path";
import { checkbox, input, select, Separator } from "@inquirer/prompts";
import type { InjectManifestOptions } from "@serwist/build";
import { toUnix } from "@serwist/utils";
import { glob } from "glob";
import { constants } from "./constants.js";
import { errors } from "./errors.js";

/**
 * @returns The subdirectories of the current
 * working directory, with hidden and ignored ones filtered out.
 */
const getSubdirectories = async (): Promise<string[]> => {
  return await glob("*/", {
    ignore: constants.ignoredDirectories.map((directory) => `${directory}/`),
  });
};

const askRootOfWebApp = async (): Promise<string> => {
  const subdirectories = await getSubdirectories();

  const { globDirectory, manualDirectoryInput } = await (async () => {
    if (subdirectories.length > 0) {
      const manualEntryChoice = "Manually enter path";
      const globDirectory = await select({
        message: "What is the root of your web app (i.e. which directory do you deploy)?",
        choices: [...subdirectories.map((dir) => ({ value: dir })), new Separator(), { value: manualEntryChoice }],
      });
      let manualDirectoryInput: string | undefined;
      if (globDirectory === manualEntryChoice) {
        manualDirectoryInput = await input({ message: "Please enter the path to the root of your web app:" });
      }
      return {
        globDirectory,
        manualDirectoryInput,
      };
    }

    const globDirectory = await input({ message: "Please enter the path to the root of your web app:", default: "." });

    return {
      globDirectory,
      manualDirectoryInput: undefined,
    };
  })();

  const stat = statSync(manualDirectoryInput || globDirectory);

  assert(stat.isDirectory(), errors["glob-directory-invalid"]);

  return manualDirectoryInput || globDirectory;
};

/**
 * @param globDirectory The directory used for the root of globbing.
 * @returns The unique file extensions corresponding
 * to all of the files under globDirectory.
 */
const getAllFileExtensions = async (globDirectory: string) => {
  // Use a pattern to match any file that contains a '.', since that signifies
  // the presence of a file extension.
  const files: string[] = await glob("**/*.*", {
    cwd: globDirectory,
    nodir: true,
    ignore: [
      ...constants.ignoredDirectories.map((directory) => `**/${directory}/**`),
      ...constants.ignoredFileExtensions.map((extension) => `**/*.${extension}`),
    ],
  });

  const extensions: Set<string> = new Set();
  for (const file of files) {
    const extension = path.extname(file);
    if (extension) {
      // Get rid of the leading . character.
      extensions.add(extension.replace(/^\./, ""));
    }
  }

  return [...extensions];
};

interface ConfigWithConfigLocation {
  config: {
    [key: string]: any;
  };
  configLocation: string;
}

export const askQuestions = async (): Promise<ConfigWithConfigLocation> => {
  const globDirectory = await askRootOfWebApp();

  const fileExtensions = await getAllFileExtensions(globDirectory);

  assert(fileExtensions.length > 0, errors["no-file-extensions-found"]);

  const swSrc = await input({
    message: "Where's your existing service worker file? To be used with 'injectManifest', it should include a call to 'self.__SW_MANIFEST'",
    validate(input) {
      if (typeof input !== "string") {
        return "You must provide a valid 'swSrc'!";
      }
      if (!statSync(input, { throwIfNoEntry: false })?.isFile()) {
        return "'swSrc' must point to a valid file!";
      }
      return true;
    },
  });

  const swDest = await input({
    message: "Where would you like your service worker file to be saved?",
    default: toUnix(path.join(globDirectory, "sw.js")),
    validate(input) {
      if (typeof input !== "string") {
        return "You must provide a valid 'swDest'!";
      }
      return true;
    },
  });

  const selectedExtensions = await checkbox({
    message: "Which file types would you like to precache?",
    choices: fileExtensions.map((ext) => ({ value: ext, checked: true })),
    validate(input) {
      if (!Array.isArray(input)) {
        return "'selectedExtensions' is not an array. This is most likely a bug.";
      }
      if (input.length === 0) {
        return errors["no-file-extensions-selected"];
      }
      return true;
    },
  });

  const configLocation = await input({
    message: "Where would you like to save these configuration options?",
    default: constants.defaultConfigFile,
    validate(input) {
      if (typeof input !== "string") {
        return "You must provide a valid location!";
      }
      return true;
    },
  });

  // glob isn't happy with a single option inside of a {} group, so use a
  // pattern without a {} group when there's only one extension.
  const globPatterns = [`**/*.${selectedExtensions.length === 1 ? selectedExtensions[0] : `{${selectedExtensions.join(",")}}`}`];

  const config = {
    globDirectory,
    globPatterns,
    swSrc,
    swDest,
  } satisfies InjectManifestOptions;

  return {
    config,
    configLocation,
  };
};
