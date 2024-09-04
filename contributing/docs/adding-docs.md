# Adding documentation

- The development branch is `main`.
- All pull requests should be opened against `main`.

## Developing locally:

1. Clone the Serwist repository:
   ```
   git clone https://github.com/serwist/serwist --depth=3000 --branch main --single-branch
   ```
1. Create a new branch:
   ```
   git checkout -b $YOUR_BRANCH_NAME origin/main
   ```
1. Install the dependencies with:
   ```
   pnpm install
   ```
1. `cd` into `docs`:
   ```
   cd docs
   ```
1. Start developing:

   ```
   pnpm dev
   ```

   And then edit the content in `docs/src/routes`. The app should automatically reflect the changes!

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

## Conventions

- See [Conventions](./conventions.md).

## Adding highlighted code

- Please use `<Tabs>` and `<Tab>` like so:

````
<script>
  import Tabs from "$components/Tabs.svelte";
  import Tab from "$components/Tab.svelte";
</script>

<Tabs id="install-serwist-next-instruction" tabs={[["npm", "npm-tab"], ["yarn", "yarn-tab"], ["pnpm", "pnpm-tab"], ["bun", "bun-tab"]]}>
  <Tab id="npm-tab">

```bash
npm i @serwist/next
```

  </Tab>
  <Tab id="yarn-tab">

```bash
yarn add @serwist/next
```

  </Tab>
  <Tab id="bun-tab">

```bash
pnpm add @serwist/next
```

  </Tab>
  <Tab id="bun-tab">

```bash
bun add @serwist/next
```

  </Tab>
</Tabs>
````

For the `Tabs` component, please provide it `id` and `tabs`: `id` is the prefix added to the IDs of the elements used in `Tabs` and `Tab`, and `tabs` is where you declare the tabs to the `Tabs` component (each tab should be declared in the form `[name: string, id: string]`, with `name` being the name of the tab and `id` being the string used to identify the tab). For each `Tab`, set `id` to the ID you just declared to the `Tabs` component. Since `id` is also used in the ID of the elements in `Tab`, please do not include spaces. Thanks! 

In this example, we add the `-tab` suffix to make it easy to distinguish the name and the ID. However, this is not necessary.

## Adding a page to the sidebar

- Simply edit `DOCS_SIDEBAR_LINKS`, located at docs/src/lib/constants.ts.
