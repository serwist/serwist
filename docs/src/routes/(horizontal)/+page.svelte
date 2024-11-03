<script>
  import Code from "$components/Code.svelte";
  import LogoJs from "$components/icons/LogoJs.svelte";
  import LogoNextjs from "$components/icons/LogoNextjs.svelte";
  import LogoNuxt from "$components/icons/LogoNuxt.svelte";
  import LogoSvelte from "$components/icons/LogoSvelte.svelte";
  import LogoVite from "$components/icons/LogoVite.svelte";
  import LogoWebpack from "$components/icons/LogoWebpack.svelte";
  import { clsx } from "$lib/clsx";

  import Preview from "./Preview.svx";
</script>

<div
  class={clsx(
    "flex w-full flex-col gap-8 self-stretch bg-white px-8 py-6 text-black md:gap-24 md:p-24 dark:bg-black dark:text-white",
    "[&>div]:flex [&>div]:w-full [&>div]:max-w-screen-lg [&>div]:flex-col [&>div]:gap-6 [&>div]:md:self-center"
  )}
>
  <div class="py-24 md:py-0">
    <h1 class="sr-only">Serwist</h1>
    <h2 class="text-4xl font-semibold tracking-tight">A Swiss Army knife for service workers.</h2>
    <Code showIcon>npm install -D serwist @serwist/build</Code>
    <div class="grid grid-cols-4 [&>a]:flex [&>a]:py-6 [&>a]:justify-center">
      <a href="/docs/next">
        <LogoNextjs width={40} height={40} class="h-auto w-10 contrast-0" />
      </a>
      <a href="/docs/svelte">
        <LogoSvelte width={40} height={40} class="h-auto w-10 contrast-0" />
      </a>
      <a href="/docs/nuxt">
        <LogoNuxt width={40} height={40} class="h-auto w-10 contrast-0" />
      </a>
      <a href="/docs/vite">
        <LogoVite width={40} height={40} class="h-auto w-10 contrast-0" />
      </a>
      <a href="/docs/webpack">
        <LogoWebpack width={40} height={40} class="h-auto w-10 contrast-0" />
      </a>
      <a href="/docs/build">
        <LogoJs width={40} height={40} class="h-auto w-10 contrast-0" />
      </a>
    </div>
  </div>
  <Preview />
</div>
