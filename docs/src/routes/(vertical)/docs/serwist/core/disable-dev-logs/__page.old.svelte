<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>disableDevLogs</h1>
<h2>First added</h2>
<p>8.0.0</p>
<h2>About</h2>
<p>Disables Serwist's logging in development mode.</p>
<h2>How it works</h2>
<p>
  It simply sets <InlineCode>self.__WB_DISABLE_DEV_LOGS</InlineCode> to <InlineCode>true</InlineCode>. This value is picked up by Serwist's logger.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
