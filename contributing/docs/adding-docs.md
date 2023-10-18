# Adding documentation

- The development branch is `main`.
- All pull requests should be opened against `main`.

To develop locally:

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

   And then edit the content in `docs/content`. The app should automatically reflect the changes!

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
