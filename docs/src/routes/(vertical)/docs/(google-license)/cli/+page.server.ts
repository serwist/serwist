import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/cli",
  ogImage: encodeOpenGraphImage("@serwist/cli"),
  toc: [
    {
      title: "@serwist/cli",
      id: "serwist-cli",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Install",
          id: "install",
        },
        {
          title: "Commands",
          id: "commands",
          children: [
            {
              title: "wizard",
              id: "command-wizard",
            },
            {
              title: "inject-manifest",
              id: "command-inject",
            },
          ],
        },
        {
          title: "Configuration",
          id: "configuration",
        },
        {
          title: "Is @serwist/cli the right choice for my build process?",
          id: "is-cli-right",
        },
      ],
    },
  ],
  code: {
    install: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npm i -D @serwist/cli",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/cli",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/cli",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/cli",
          lang: "bash",
        },
      },
      { idPrefix: "install" },
    ),
    wizard: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npx @serwist/cli wizard",
          lang: "bash",
        },
        yarn: {
          code: "yarn serwist wizard",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm serwist wizard",
          lang: "bash",
        },
        bun: {
          code: "bun serwist wizard",
          lang: "bash",
        },
      },
      { idPrefix: "command-wizard" },
    ),
    injectManifest: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npx @serwist/cli inject-manifest",
          lang: "bash",
        },
        yarn: {
          code: "yarn serwist inject-manifest",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm serwist inject-manifest",
          lang: "bash",
        },
        bun: {
          code: "bun serwist inject-manifest",
          lang: "bash",
        },
      },
      { idPrefix: "command-inject" },
    ),
  },
});
