<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>disableDevLogs</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>8.0.0</p>
<br /><br />
<h2>About</h2>
<br />
<p>Disables Serwist's logging in development mode.</p>
<br /><br />
<h2>How it works</h2>
<br />
<p>
  It simply sets <InlineCode>self.__WB_DISABLE_DEV_LOGS</InlineCode> to <InlineCode>true</InlineCode>. This value is picked up by Serwist's logger.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
