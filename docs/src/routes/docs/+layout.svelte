<div class="relative flex h-full w-full flex-col md:flex-row">
  <div class="z-10 flex w-full flex-col print:hidden sticky top-[var(--navbar-height)] md:w-64 md:shrink-0 md:self-start">
    <button
      class="z-20 flex h-fit w-full flex-row items-center justify-start gap-2 px-4 py-3 md:hidden bg-gray-100 text-black duration-100 dark:bg-neutral-950 dark:text-white border-b border-neutral-200/70 dark:border-neutral-400/10"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-transform duration-100"
        aria-hidden="true"><path d="M9 6l6 6l-6 6"></path></svg
      > Menu</button
    >
    <aside
      class="h-[calc(100vh-100px)] grow overflow-y-auto overflow-x-hidden px-4 pb-4 md:pt-4 transform-gpu transition-all duration-150 ease-out bg-gray-50 dark:bg-neutral-950 border-b border-neutral-200/70 dark:border-neutral-400/10 absolute max-md:[transform:translate(0,-100%)] md:[position:unset]"
    ></aside>
  </div>
  <nav class="order-last hidden w-[350px] shrink-0 px-4 print:hidden xl:block" aria-label="Table of contents">
    <div class="sticky top-16 flex max-h-[calc(100vh-100px)] flex-col hyphens-auto pr-4 pt-6 text-sm ltr:-mr-4 rtl:-ml-4">
      <p class="mb-4 font-semibold tracking-tight text-black dark:text-white">On This Page</p>
      <div class="w-full self-stretch overflow-y-auto"></div>
      <div class="sticky bottom-0 mt-8 flex flex-col items-start gap-2 border-t pb-8 pt-8 dark:border-neutral-800">
        <a
          href="https://github.com/DuCanhGH/next-pwa/issues/new/choose"
          target="_blank"
          rel="noreferrer"
          class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >Question? Give us feedback →<span class="sr-only"> (opens in a new tab)</span></a
        ><a
          href="https://github.com/DuCanhGH/next-pwa/tree/master/docs/content/index.mdx"
          target="_blank"
          rel="noreferrer"
          class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >Edit this page →<span class="sr-only"> (opens in a new tab)</span></a
        >
      </div>
    </div>
  </nav>
  <article class="w-full min-w-0 md:py-8">
    <div class="w-full min-w-0 max-w-6xl px-6 py-4 md:px-12">
      <slot />
    </div>
  </article>
</div>
