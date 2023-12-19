<script>
  import Text from "$components/Text.svelte";
  import { clsx } from "$lib/clsx";
</script>

<div class="flex h-full w-full flex-col md:flex-row">
  <aside
    class={clsx(
      "print:hidden max-h-[calc(100vh-100px)] w-full overflow-y-auto overflow-x-hidden md:w-64 md:shrink-0 md:self-start z-10",
      "px-4 pb-4 md:pt-4 transform-gpu transition-all duration-150 ease-out sticky top-[65px]"
    )}
  >
    <Text>aside</Text>
  </aside>
  <nav class="order-last hidden w-[350px] shrink-0 px-4 print:hidden xl:block" aria-label="Table of contents">
    <div class="sticky top-[65px] flex max-h-[calc(100vh-100px)] flex-col hyphens-auto pr-4 pt-6 text-sm ltr:-mr-4 rtl:-ml-4">
      <p class="mb-4 font-semibold tracking-tight text-black dark:text-white">On This Page</p>
      <div class="w-full self-stretch overflow-y-auto pointer-events-none" aria-hidden="true" />
      <div class="sticky bottom-0 mt-8 flex flex-col items-start gap-2 border-t pb-8 pt-8 dark:border-neutral-800">
        <a
          href="https://github.com/DuCanhGH/next-pwa/issues/new/choose"
          target="_blank"
          rel="noreferrer"
          class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Question? Give us feedback →<span class="sr-only"> (opens in a new tab)</span>
        </a>
        <a
          href="https://github.com/DuCanhGH/next-pwa/tree/master/docs/content/index.mdx"
          target="_blank"
          rel="noreferrer"
          class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Edit this page →<span class="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  </nav>
  <article class="w-full min-w-0 md:py-8">
    <div class="w-full min-w-0 max-w-6xl px-6 py-4 md:px-12">
      <slot />
    </div>
  </article>
</div>
