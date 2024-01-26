# Adding documentation

- The development branch is `main`.
- All pull requests should be opened against `main`.

## Developing locally:

1. Clone the Serwist repository:
   ```bash
   git clone https://github.com/serwist/serwist -- --depth=3000 --branch main --single-branch
   ```
1. Create a new branch:
   ```bash
   git checkout -b MY_BRANCH_NAME origin/main
   ```
1. Install the dependencies with:
   ```bash
   pnpm install
   ```
1. `cd` into `docs`:
   ```bash
   cd docs
   ```
1. Start developing:

   ```bash
   pnpm dev
   ```

   And then edit the content in `docs/src/routes`. The app should automatically reflect the changes!

1. When your changes are finished, commit them to the branch:
   ```
   git add .
   git commit -m "DESCRIBE_YOUR_CHANGES_HERE"
   ```
1. When you are ready to push, make a fork and then run:
   ```
   git remote set-url origin https://github.com/YOURNAME/serwist
   git push
   ```

## Why not Markdown?

- Although Markdown itself is a great technology, one found it to be... rather difficult to setup and maintain, especially with SvelteKit. The documentation site of `@ducanh2912/next-pwa` serves as a painful example of having to jump through hoops so as to use this technology (certain dependencies... simply can't be updated, and the code behind the docs was rather... an eyesore). As such, we use Svelte itself to write the documentation. Although doing so involves more manual work, it is easier to read and maintain, less hacky, more foolproof, and more customizable.

## Conventions

- See [Conventions](./conventions.md).