<script lang="ts">
  import InlineCode from "$components/InlineCode.svelte";
  import { clsx } from "$lib/clsx";

  interface Feature {
    icon: string;
    label: string;
    description: string;
  }

  export const FEATURES_LIST = [
    {
      icon: "✊",
      label: "Lorem ipsum",
      description: "Lorem ipsum...",
    },
    {
      icon: "⛏️",
      label: "Configurable",
      description: "...yet there are many options available to extend the plugin.",
    },
    {
      icon: "💯",
      label: "Fast",
      description: "Blow your user's mind with a website as fast as lightning ⚡",
    },
    {
      icon: "🔌",
      label: "Offline",
      description: "Proper offline support. For both App and Pages Router.",
    },
    {
      icon: "🚀",
      label: "Developer experience",
      description: "Built-in TypeScript definitions and JSDoc to enable the best DX.",
    },
  ] satisfies Feature[];
</script>

<div class="w-full self-stretch bg-white text-black dark:bg-black dark:text-white">
  <div class="flex w-full flex-col items-center justify-center gap-5 px-5 py-40">
    <h1
      class={clsx(
        "my-2 text-5xl font-extrabold tracking-tight",
        "bg-gradient-to-t from-gray-500 to-black bg-clip-text text-transparent dark:from-gray-400 dark:to-white"
      )}
    >
      Make performant web apps with Serwist.
    </h1>
    <h2 class="my-2 text-2xl font-medium tracking-tight opacity-80">Serwist enables you to create PWAs with ease.</h2>
    <a
      class={clsx(
        "rounded-md border px-6 py-3 font-bold transition-colors duration-100",
        "bg-black text-white dark:bg-white dark:text-black",
        "hover:border-black hover:bg-white hover:text-black",
        "hover:dark:border-white hover:dark:bg-black hover:dark:text-white",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      )}
      href="#main-content"
    >
      Get started
    </a>
    <InlineCode dir="ltr">npx create-next-app@latest -e https://github.com/serwist/serwist/tree/main/examples/next-basic</InlineCode>
  </div>
  <div class="w-full p-4 md:p-24">
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
  </div>
</div>
