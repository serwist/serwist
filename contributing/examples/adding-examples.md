## Adding examples

When you add an example to the [examples](https://github.com/serwist/serwist/tree/main/examples) directory, please follow these guidelines:

- TypeScript should be leveraged for new examples.
- If an example exists for a certain library and you would like to showcase a specific feature of that library, the existing example should be updated (instead of adding a new example).
- Package manager specific config should not be added (e.g. `resolutions` in `package.json`).
- Dependencies' versions should be up-to-date (you can run `pnpm deps` in this repo's root directory to update everything in it).
- Example directories should not be prefixed with `with-`.
- Make sure linting passes (you can run `pnpm build && pnpm examples:lint` to verify and `pnpm examples:lint -- --fix` for automatic fixes).
- Avoid running `pnpm examples:build` as it is resource-heavy.

Also, don’t forget to add a `README.md` file with the following format:

- Replace `DIRECTORY_NAME` with the directory name you’re adding.
- Fill in `Serwist example - EXAMPLE_NAME` and `DESCRIPTION`.
- To add additional notes, add `## Notes` section at the end.
- For framework-specific templates, see below.
  - [Next.js](./adding-examples-next.md)
  - [Vite](./adding-examples-vite.md)
