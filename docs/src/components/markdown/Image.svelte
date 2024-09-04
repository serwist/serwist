<script lang="ts">
  import type { Image } from "mdast";
  import type { RendererProps } from "./types";

  const { url, title }: RendererProps<Image> = $props();
</script>

<picture>
  <source media="(min-width: 512px)" srcset="https://wsrv.nl/?url={url}&h=256&dpr=2)" />
  <source srcset="https://wsrv.nl/?url={url}&h=256&dpr=1)" />
  <img
    src="https://wsrv.nl/?url={url}&h=128&dpr=4)"
    {title}
    alt={title}
    height={512}
    class="h-64 w-auto object-contain lg:h-[32rem] mx-auto"
    loading="lazy"
    decoding="async"
  />
</picture>
