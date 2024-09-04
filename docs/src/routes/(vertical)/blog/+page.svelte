<script>
  import { BLOG_ENTRIES } from "$lib/constants";
</script>

<main id="main-content" class="flex w-full flex-col xl:flex-row xl:justify-between">
  <article class="prose flex w-full max-w-6xl flex-col p-6 md:px-12 md:pb-12 xl:pt-12">
    <h1>Blog</h1>
    <div class="my-3 grid grid-flow-row gap-4 lg:grid-cols-3">
      {#each BLOG_ENTRIES as { title, description, date, href, keyPoints }}
        <article
          class="not-prose dark:bg-neutral-925 flex min-w-0 flex-col gap-3 rounded-[.875rem] border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-800"
        >
          <div class="flex flex-col gap-1 p-2">
            <p class="text-comment text-sm">{date}</p>
            <p class="text-2xl font-semibold">{title.content}</p>
            <p>{description}</p>
          </div>
          <ul class="list pr-2">
            {#each keyPoints as { title, id }}
              <li><a href={`${href}#${id}`} class="link">{title}</a></li>
            {/each}
          </ul>
          <a class="button" {href}>Read the blog</a>
        </article>
      {/each}
    </div>
  </article>
</main>
