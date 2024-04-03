<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="abstractions">Abstracting away the APIs</h1>
<h2 id="introduction">Introduction</h2>
<p>
  Flexible as Serwist is, it cannot avoid making its APIs rather complex and unwelcoming to new users. As such, it provides abstractions to help you
  get started with just a few lines of code.
</p>
<h2 id="usage">Usage</h2>
<p>To get started with Serwist, you only need as much code as the following snippet:</p>
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
<h3 id="customizing-the-behaviour">Customizing the behaviour</h3>
<p>
  However, in most cases, the defaults probably do not suit you. For example, you may want Serwist to precache some URLs, sometimes concurrently as
  well; clean up outdated caches; or claim all available clients on activation. The <ICD>Serwist</ICD> class allows you to change its
  <ICD>PrecacheController</ICD> and <ICD>Router</ICD> instances and customize its <ICD>install</ICD> function's behaviour.
</p>
<CodeTab codes={data.code.basicUsage.customizing} defaultTab="sw.ts" />
