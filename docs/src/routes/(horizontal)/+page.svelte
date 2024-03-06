<script lang="ts">
  import type { ComponentType, SvelteComponent } from "svelte";
  import type { SVGAttributes } from "svelte/elements";

  import CodeTab from "$components/CodeTab.svelte";
  import NextjsLogo from "$components/icons/NextjsLogo.svelte";
  import NuxtLogo from "$components/icons/NuxtLogo.svelte";
  import SvelteLogo from "$components/icons/SvelteLogo.svelte";
  import ViteLogo from "$components/icons/ViteLogo.svelte";
  import WebpackLogo from "$components/icons/WebpackLogo.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import { clsx } from "$lib/clsx";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();

  interface Feature {
    icon: string;
    label: string;
    description: string;
  }

  const FEATURES_LIST = [
    {
      icon: "✨",
      label: "Stellar",
      description: "Beautifully designed APIs to blow your mind away~",
    },
    {
      icon: "🪄",
      label: "Enchanted",
      description: "SO. MANY. OPTIONS. Why would you want to be locked down to having nothing?",
    },
    {
      icon: "💯",
      label: "Rapid",
      description: "A website as fast as lightning ⚡ Who wouldn't want that?",
    },
    {
      icon: "🔌",
      label: "Wide-ranging",
      description: "Do it your way. The API design allows for anything 🚀",
    },
    {
      icon: "💪",
      label: "Indefatigable",
      description: "Always working hard as a community! This project wouldn't have come to be otherwise...",
    },
    {
      icon: "🚀",
      label: "Satisfactory",
      description: "Built-in TypeScript definitions and JSDoc. NodeNext. ESM. CommonJS. All supported.",
    },
    {
      icon: "🤝",
      label: "Trustworthy",
      description: "Regularly maintained. Completely open. What's there to doubt?",
    },
  ] satisfies Feature[];

  type ToolKey = "nextjs" | "webpack" | "vite" | "svelte" | "nuxt";

  interface Tool {
    key: ToolKey;
    logo: ComponentType<SvelteComponent<SVGAttributes<SVGElement>>>;
    id: string;
    label: string;
    codes: [string, string, string][];
    defaultTab: string;
    additionalClass?: string;
  }

  interface ToolInfo {
    title: string;
    description: string;
  }

  const TOOLS_LIST = [
    {
      key: "nextjs",
      logo: NextjsLogo,
      id: "nextjs-config-showcase",
      label: "Next.js",
      codes: data.code.frameworks.next,
      defaultTab: "next.config.mjs",
      additionalClass: "dark:invert",
    },
    {
      key: "webpack",
      logo: WebpackLogo,
      id: "webpack-config-showcase",
      label: "webpack",
      codes: data.code.frameworks.webpack,
      defaultTab: "webpack.config.ts",
    },
    {
      key: "vite",
      logo: ViteLogo,
      id: "vite-config-showcase",
      label: "Vite",
      codes: data.code.frameworks.vite,
      defaultTab: "vite.config.ts",
    },
    {
      key: "svelte",
      logo: SvelteLogo,
      id: "svelte-config-showcase",
      label: "Svelte",
      codes: data.code.frameworks.svelte,
      defaultTab: "src/service-worker.ts",
    },
    {
      key: "nuxt",
      logo: NuxtLogo,
      id: "nuxt-config-showcase",
      label: "Nuxt",
      codes: data.code.frameworks.nuxt,
      defaultTab: "nuxt.config.ts",
    },
  ] satisfies Tool[];

  const MAP_TOOL_KEY_TO_INFO: Record<ToolKey, ToolInfo> = {
    nextjs: {
      title: "Next.js",
      description: "The classic React framework.",
    },
    webpack: {
      title: "webpack",
      description: "The good old reliable bundler.",
    },
    vite: {
      title: "Vite",
      description: "The speedy frontend build tool.",
    },
    svelte: {
      title: "Svelte",
      description: "The admired JS web framework.",
    },
    nuxt: {
      title: "Nuxt",
      description: "The intuitive Vue framework.",
    },
  };

  let currentSelectedTool = $state<ToolKey>("nextjs");
  let currentSelectedToolInfo = $derived(MAP_TOOL_KEY_TO_INFO[currentSelectedTool]);
</script>

<div class="flex w-full flex-col gap-8 self-stretch bg-white px-5 py-4 text-black md:gap-24 md:p-24 dark:bg-black dark:text-white">
  <div class="flex w-full flex-col items-center justify-center gap-5 py-24 md:mb-24 md:py-0">
    <enhanced:img
      src="$images/logo-800x200.png?w=400;200;100"
      alt="Serwist"
      class="h-auto w-[150px] invert md:w-[200px] dark:invert-0"
      sizes="(min-width:1920px) 400px, (min-width:1080px) 250px, (min-width:768px) 200px"
    />
    <h1 class="my-2 text-center text-5xl font-semibold tracking-tight">A Swiss Army knife for service workers.</h1>
    <h2 class="my-2 text-center text-2xl font-medium tracking-tight">Serwist enables you to create PWAs with ease.</h2>
    <a class="text-accent-light dark:text-accent-dark text-xl underline underline-offset-8" href="/docs">
      {"~> Get started"}
    </a>
    <InlineCode showIcon>{"npx create-next-app@latest -e https://github.com/serwist/serwist/tree/main/examples/next-basic"}</InlineCode>
  </div>
  <div class="grid w-full text-left lg:mb-0 lg:grid-cols-4 lg:gap-2">
    {#each FEATURES_LIST as feature}
      <div
        class={clsx(
          "rounded-lg border border-transparent px-5 py-4 transition-colors",
          "hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        )}
      >
        <h2 class="mb-3 text-2xl font-semibold">
          {feature.icon}
          {feature.label}
        </h2>
        <p class="m-0 max-w-[30ch] text-sm opacity-80">
          {feature.description}
        </p>
      </div>
    {/each}
  </div>
  <div class="flex w-full flex-col gap-4 md:max-w-screen-lg md:self-center">
    <h2 class="text-4xl font-semibold tracking-tight">Using a framework?</h2>
    <div class="flex flex-col justify-between gap-4 md:flex-row">
      <div class="flex flex-col gap-2">
        <h3 class="text-3xl font-semibold tracking-tight">Worry not. We support {currentSelectedToolInfo.title}.</h3>
        <h4 class="text-2xl font-semibold tracking-tight">{currentSelectedToolInfo.description}</h4>
      </div>
      <div role="tablist" class="flex flex-wrap gap-8">
        {#each TOOLS_LIST as { key, logo: Logo, id, label, additionalClass }}
          {@const isActive = currentSelectedTool === key}
          <button
            class={clsx("frsc-button flex-1", isActive ? "active" : "inactive")}
            id={`${id}-button`}
            role="tab"
            aria-controls={`${id}-code`}
            aria-selected={isActive}
            onclick={() => (currentSelectedTool = key)}
          >
            <Logo class={clsx("transition-all duration-100", additionalClass)} width={64} height={64} aria-hidden="true" />
            <span class="sr-only">{label}</span>
          </button>
        {/each}
      </div>
    </div>
    <div class="overflow-hidden">
      {#each TOOLS_LIST as { key, id, codes, defaultTab }}
        {@const isActive = currentSelectedTool === key}
        <div role="tabpanel" id={`${id}-code`} aria-labelledby={`${id}-button`}>
          {#if isActive}
            <CodeTab codes={codes as [string, string, string][]} {defaultTab} />
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <div class="flex w-full flex-col gap-4 md:max-w-screen-lg md:self-center">
    <h2 class="text-4xl font-semibold tracking-tight">Not using one?</h2>
    <h3 class="text-3xl font-semibold tracking-tight">We got you!</h3>
    <div class="overflow-hidden">
      <CodeTab codes={data.code.vanilla} defaultTab="build.ts" />
    </div>
  </div>
  <div class="flex w-full flex-col gap-4 md:max-w-screen-lg md:self-center">
    <h2 class="text-4xl font-semibold tracking-tight">Customizing?</h2>
    <h3 class="text-3xl font-semibold tracking-tight">Go ham.</h3>
    <CodeTab codes={data.code.customizing} defaultTab="@serwist/build" />
  </div>
</div>
