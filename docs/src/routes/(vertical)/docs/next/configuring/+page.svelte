<script>
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Link from "$components/Link.svelte";
  import Text from "$components/Text.svelte";
</script>

<Heading type="display">Configuring</Heading>
<br /><br />
<Heading type="title-large">Available options</Heading>
<br />
<Text>There are various options you can use to customize the behaviour of the plugin:</Text>
<br />
<ul class="list-inside list-disc marker:text-black dark:marker:text-white">
  <li>
    <InlineCode>
      <Link href="/docs/next/configuring/cache-on-front-end-nav">cacheOnFrontEndNav</Link>
    </InlineCode>
  </li>
  <li>
    <InlineCode>
      <Link href="/docs/next/configuring/disable">disable</Link>
    </InlineCode>
  </li>
  <li>
    <InlineCode>
      <Link href="/docs/next/configuring/scope">scope</Link>
    </InlineCode>
  </li>
  <li>
    <InlineCode>
      <Link href="/docs/next/configuring/sw-url">swUrl</Link>
    </InlineCode>
  </li>
  <li>
    <InlineCode>
      <Link href="/docs/next/configuring/register">register</Link>
    </InlineCode>
  </li>
  <li>
    <InlineCode>
      <Link href="/docs/next/configuring/reload-on-online">reloadOnOnline</Link>
    </InlineCode>
  </li>
</ul>
<br />
<Text>Aside from these, all options of <InlineCode>@serwist/build.injectManifest</InlineCode> are available!</Text>
