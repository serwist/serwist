<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<div>
  <Heading type="display">Getting started</Heading>
  <br /><br />
  <Heading type="title-large">Install</Heading>
  <br />
  <Text>Run the following command:</Text>
  <br />
  <CodeTab
    codes={{
      npm: data.code.install.npm,
      yarn: data.code.install.yarn,
      pnpm: data.code.install.pnpm,
      bun: data.code.install.bun,
    }}
    idPrefix="install-serwist-next-instruction"
    defaultTab="npm"
  />
  <br /><br />
  <Heading type="title-large">Basic usage</Heading>
  <br />
  <Heading type="title">
    Step 1: Wrap your Next.js config with <span class="inline-block"><InlineCode>withSerwist</InlineCode></span>
  </Heading>
  <br />
  <Text>Update or create next.config.js with the following content:</Text>
  <br />
  <CodeTab
    codes={{
      "next.config.mjs": data.code.basicUsage.wrapConfig.configMjs,
      "next.config.js": data.code.basicUsage.wrapConfig.configJs,
      "next.config.mjs (light)": data.code.basicUsage.wrapConfig.lightConfigMjs,
      "next.config.js (light)": data.code.basicUsage.wrapConfig.lightConfigJs,
    }}
    idPrefix="basic-usage-wrap-config-instruction"
    defaultTab="next.config.mjs"
  />
  <br /><br />
  <Heading type="title">
    Step 2: Create {"app/sw.{ts,js}"} with:
  </Heading>
  <br />
  <CodeTab
    codes={{
      "app/sw.ts": data.code.basicUsage.createEntry.ts,
      "app/sw.js": data.code.basicUsage.createEntry.js,
    }}
    idPrefix="basic-usage-create-entry-instruction"
    defaultTab="app/sw.ts"
  />
  <br /><br />
  <Heading type="title">Step 3: Add a manifest.json file:</Heading>
  <br />
  <Text>Create a manifest.json file in your public folder:</Text>
  <br />
  <CodeTab
    codes={{
      "public/manifest.json": data.code.basicUsage.manifestJson,
    }}
    idPrefix="basic-usage-manifest-json-instruction"
    defaultTab="public/manifest.json"
  />
  <br /><br />
  <Heading type="title">
    Step 4: Add <InlineCode>{"<meta />"}</InlineCode> and <InlineCode>{"<link />"}</InlineCode> tags to your <InlineCode>{"<head />"}</InlineCode>
  </Heading>
  <br />
  <Text>
    Add the following to your {"app/layout.{tsx,js,jsx}"} or {"pages/_app.{tsx,js,jsx}"}:
  </Text>
  <br />
  <CodeTab
    codes={{
      "app/layout.tsx": data.code.basicUsage.metaAndLinkTags.appDir.ts,
      "app/layout.js": data.code.basicUsage.metaAndLinkTags.appDir.js,
      "pages/_app.tsx": data.code.basicUsage.metaAndLinkTags.pagesDir.ts,
      "pages/_app.js": data.code.basicUsage.metaAndLinkTags.pagesDir.js,
    }}
    idPrefix="basic-usage-meta-and-link-tags-instruction"
    defaultTab="app/layout.tsx"
  />
</div>
