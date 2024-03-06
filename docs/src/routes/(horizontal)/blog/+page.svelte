<script>
  import { BLOG_ENTRIES } from "./$page.constants";
</script>

<article class="flex gap-8 flex-col p-6 md:py-12 md:max-w-screen-xl mx-auto">
  <h1>Blog</h1>
  <div class="grid grid-flow-row md:grid-cols-3 gap-4">
    {#each BLOG_ENTRIES as { title, description, date, href, keyPoints }}
      <article class="min-w-0 rounded-[.875rem] bg-white dark:bg-neutral-950 border-[0.5px] border-gray-300 dark:border-gray-800 p-2 flex gap-3 flex-col">
        <div class="p-2 flex flex-col gap-1">
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
