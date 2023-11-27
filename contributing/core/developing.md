# Developing

- The development branch is `main`.
- All pull requests should be opened against `main`.

To develop locally:

1. Clone the Serwist repository:
   ```bash
   git clone https://github.com/serwist -- --depth=3000 --branch main --single-branch
   ```
1. Create a new branch:
   ```bash
   git checkout -b MY_BRANCH_NAME origin/main
   ```
1. Install the dependencies with:
   ```bash
   pnpm install
   ```
1. Start developing and watch for code changes:
   ```bash
   pnpm dev
   ```
1. When your changes are finished, commit them to the branch:
   ```
   git add .
   git commit -m "DESCRIBE_YOUR_CHANGES_HERE"
   ```
1. When you are ready to push, make a fork and then run:
   ```
   git remote set-url origin https://github.com/YOUR_NAME/serwist
   git push -u origin MY_BRANCH_NAME
   ```
