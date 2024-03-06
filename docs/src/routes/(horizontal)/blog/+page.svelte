<script>
  import { BLOG_ENTRIES } from "./$page.constants";
</script>

<article class="mx-auto flex flex-col gap-8 p-6 md:max-w-screen-xl md:py-12">
  <h1>Blog</h1>
  <div class="grid grid-flow-row gap-4 md:grid-cols-3">
    {#each BLOG_ENTRIES as { title, description, date, href, keyPoints }}
      <article
        class="flex min-w-0 flex-col gap-3 rounded-[.875rem] border-[0.5px] border-gray-300 bg-white p-2 dark:border-gray-800 dark:bg-neutral-950"
      >
        <div class="flex flex-col gap-1 p-2">
          <p class="text-comment text-sm">{date}</p>
          <p class="text-2xl font-semibold">{title}</p>
          <p>{description}</p>
        </div>
        <ul class="list pr-2">
          {#each keyPoints as { title, id }}
            <li><a href={`${href}#${id}`} class="link">{title}</a></li>
          {/each}
        </ul>
        <a class="button" {href}>Read more</a>
      </article>
    {/each}
  </div>
</article>
