<script>
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Link from "$components/Link.svelte";
  import Text from "$components/Text.svelte";
</script>

<div>
  <Heading type="display">Welcome to <InlineCode>@serwist/next</InlineCode>!</Heading>
  <br /><br />
  <Heading type="title-large">What is <InlineCode>@serwist/next</InlineCode>?</Heading>
  <br />
  <Text>
    <InlineCode>@serwist/next</InlineCode> is a plugin for Next.js that allows you to create a PWA with it.
  </Text>
  <br /><br />
  <Heading type="title-large">How to install <InlineCode>@serwist/next</InlineCode>?</Heading>
  <br />
  <Text>
    See <Link href="/docs/next/getting-started">Getting started</Link>. It should have ample information on how to set up!
  </Text>
</div>
