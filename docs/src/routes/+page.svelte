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
      description: "Built-in TypeScript definitions and JSDoc. NodeNext. ESM. CommonJS. All supported. Just comfortable.",
    },
    {
      icon: "🤝",
      label: "Trustworthy",
      description: "Regularly maintained. Completely open. What's there to doubt?",
    },
  ] satisfies Feature[];
</script>

<div class="w-full self-stretch bg-white text-black dark:bg-black dark:text-white">
  <div class="flex w-full flex-col items-center justify-center gap-5 px-5 py-24">
    <enhanced:img
      src="$images/logo-800x200.png?w=400;200;100"
      alt="Serwist"
      class="invert dark:invert-0 w-[150px] md:w-[200px] h-auto"
      sizes="(min-width:1920px) 400px, (min-width:1080px) 250px, (min-width:768px) 200px"
    />
    <h1 class="my-2 text-5xl font-semibold tracking-tight text-center">
      Create Progressive Web Apps<br /> with Serwist.
    </h1>
    <h2 class="my-2 text-2xl font-medium tracking-tight text-center">Serwist enables you to create PWAs with ease.</h2>
    <a class="text-accent-light dark:text-accent-dark underline underline-offset-8 text-xl" href="#main-content">
      {"~> Get started"}
    </a>
    <InlineCode>{"npx create-next-app@latest -e https://github.com/serwist/serwist/tree/main/examples/next-basic"}</InlineCode>
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
