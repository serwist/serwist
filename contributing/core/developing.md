# Developing

## Setting up

- The development branch is `main`.
- All pull requests should be opened against `main`.

To develop locally:

1. Clone the Serwist repository:
   ```
   git clone https://github.com/serwist/serwist -- --depth=3000 --branch main --single-branch
   ```
1. Create a new branch:
   ```
   git checkout -b $YOUR_BRANCH_NAME origin/main
   ```
1. Install the dependencies with:
   ```
   pnpm install
   ```
1. Start developing and watch for code changes:
   ```
   pnpm dev
   ```
1. When your changes are finished, commit them to the branch:
   ```
   git add .
   git commit -m "$DESCRIBE_YOUR_CHANGES_HERE"
   ```
1. When you are ready to push, make a fork and then run:
   ```
   git remote set-url origin https://github.com/$YOUR_NAME/serwist
   git push -u origin $YOUR_BRANCH_NAME
   ```

## Recommended .vscode/settings.json

If you use Visual Studio Code, you may want to set .vscode/settings.json to this:

```json
{
  "typescript.preferences.autoImportFileExcludePatterns": [
    "./packages/sw/src/index.ts",
    "./packages/sw/src/index.*.ts",
  ],
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
}
```
