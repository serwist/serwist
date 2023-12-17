<script lang="ts">
  // Merely a prototype.
  import "highlight.js/styles/github-dark.min.css";

  import highlightjs from "highlight.js/lib/core";
  let code = $state("<diV></div>");
  $effect(() => {
    const loadHighlightjs = async () => {
      highlightjs.registerLanguage("javascript", (await import("highlight.js/lib/languages/javascript")).default);

      code = highlightjs.highlight(
        `const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
});

module.exports = withPWA({
    // Your Next.js config
});`,
        { language: "javascript" }
      ).value;
    };
    loadHighlightjs();
  });
</script>

<div class="rounded-md bg-[#0d1117] flex flex-col overflow-hidden">
  <div class="w-full bg-[#010409]">
    <button class="p-2 bg-[#0d1117] border-t-[#f78166] border-t border-r border-r-[#30363d] text-[#c9d1d9]">next.config.js</button>
  </div>
  <div class="margin-0 p-4 overflow-auto">
    <pre class="whitespace-normal">
        <!-- Only use trusted code! -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <code class="block w-fit whitespace-pre">{@html code}</code>
    </pre>
  </div>
</div>
