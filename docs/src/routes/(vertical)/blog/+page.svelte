<script>
  import { BLOG_ENTRIES } from "./$layout.constants";
</script>

<h1>Blog</h1>
<div class="grid grid-flow-row gap-4 lg:grid-cols-3 my-3">
  {#each BLOG_ENTRIES as { title, description, date, href, keyPoints }}
    <article
      class="not-prose flex min-w-0 flex-col gap-3 rounded-[.875rem] border-[0.5px] border-gray-300 bg-white p-2 dark:border-gray-800 dark:bg-neutral-950"
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
