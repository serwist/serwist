<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-window">@serwist/window</h1>
<ExternalLink class="link" href="https://developer.chrome.com/docs/workbox/modules/workbox-window">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ExternalLink>
<h2 id="introduction">Introduction</h2>
<p>
  <ICD>@serwist/window</ICD> is a set of modules intended for the <ICD>window</ICD> context and meant to complement Serwist's service worker packages.
</p>
<h2 id="install">Install</h2>
<p>To install <ICD>@serwist/window</ICD>, run the following command in your terminal:</p>
<CodeTab codes={data.code.install} defaultTab="npm" />
<p>Then import <ICD>Serwist</ICD> into your application:</p>
<CodeTab codes={data.code.import} defaultTab="index.ts" />
<Callout type="warning">
  This Serwist class is not to be confused with the serwist.Serwist class! One is meant for the window context, and the other is supposed to be run in
  a service worker.
</Callout>
<p>
  You can also dynamically import <ICD>@serwist/window</ICD>, helping reduce the size of your page's main bundle.
</p>
<h2 id="examples">Examples</h2>
<p>
  Once you've imported the <ICD>Serwist</ICD> class, you can use it to register and interact with your service worker. Here are some examples of ways you
  might use the <ICD>Serwist</ICD> class in your application:
</p>
<h3 id="examples-waiting">Notify the user if a service worker has installed but is stuck waiting to activate</h3>
<p>
  When a page controlled by an existing service worker registers a new service worker, by default that service worker will not activate until all
  clients controlled by the previous service worker have fully unloaded.
</p>
<p>
  This is a common source of confusion for developers, especially in cases where reloading the current page doesn't cause the new service worker to
  activate.
</p>
<p>
  To help minimize confusion and make it clear when this situation is happening, the <ICD>Serwist</ICD> class allows you to listen to the
  <ICD>waiting</ICD> event:
</p>
<CodeTab codes={data.code.examples.waiting} defaultTab="index.ts" />
<h3 id="examples-broadcast-update">Notify the user of cache updates</h3>
<p>
  <a class="link" href="/docs/serwist/core/broadcast-cache-update"><ICD>BroadcastCacheUpdate</ICD></a> and
  <a class="link" href="/docs/serwist/runtime-caching/plugins/broadcast-update-plugin"><ICD>BroadcastUpdatePlugin</ICD></a> are great ways to inform the user of updates
  to cached content.
</p>
<p>Here is how you can listen to those updates from the window:</p>
<CodeTab codes={data.code.examples.broadcastUpdate} defaultTab="index.ts" />
<h2 id="sw-lifecycle">Important service worker lifecycle moments</h2>
<p>Here is a breakdown of all the important service worker lifecycle moments:</p>
<h3 id="sw-installed-event">The installed event</h3>
<p>This is when a new service worker has installed, and new assets may have just finished precaching.</p>
<p>
  If this is not the very first service worker install (<ICD>event.isUpdate === true</ICD>), it means a newer version of the service worker has been
  found and installed (that is, a different version from the one currently controlling the page).
</p>
<Callout type="info">
  Note: some developers use the installed event to inform users that a new version of their site is available. However, depending on whether you call
  skipWaiting() in the installing service worker, that installed service worker may or may not become active right away. If you do call skipWaiting()
  then it's best to inform users of the update once the new service worker has activated. Otherwise, it's better to inform them of the pending update
  in the waiting event.
</Callout>
<h3 id="sw-waiting-event">The waiting event</h3>
<p>
  If the updated version of your service worker does not call <ICD>skipWaiting()</ICD>, it will not activate until all pages controlled by the
  currently active service worker have unloaded. Basically, the updated service worker is stuck in the waiting phase. You may want to inform the user
  that an update is available and will be applied the next time they visit.
</p>
<Callout type="warning">
  It's common for developers to prompt users to reload to get the update, but in many cases refreshing the page will not activate the installed
  worker. If the user refreshes the page and the service worker is still waiting, the waiting event will fire again and the
  event.wasWaitingBeforeRegister property will be true.
</Callout>
<p>
  Another option is to prompt the user and ask whether they want to get the update or continue waiting. If they choose to get the update, you can use
  <ICD>postMessage()</ICD> to tell the service worker to run <ICD>skipWaiting()</ICD>. To do this, in your service worker, add the following:
</p>
<CodeTab codes={data.code.examples.skipWaitingManual.serviceWorker} defaultTab="sw.ts" />
<Callout type="info">If you use the serwist.Serwist class and set skipWaiting to false, the above code is automatically executed for you.</Callout>
<p>And in your application, add the following:</p>
<CodeTab codes={data.code.examples.skipWaitingManual.client} defaultTab="index.ts" />
<h3 id="sw-controlling-event">The controlling event</h3>
<p>
  Once a new service worker is installed and starts controlling the page, all subsequent <ICD>fetch</ICD> events will go through that service worker.
</p>
<p>
  If this is not the very first service worker install, this event being fired means the version of your service worker currently controlling is
  different from the version that was in control when the page was loaded. In some cases that may be fine, but it can also mean that some assets
  referenced by the current page are either no longer in the cache and possibly also not on the server or updated in ways the current page can't
  predict. You may want to consider informing the user that some parts of the page may not work correctly.
</p>
<Callout type="info">The controlling event will not fire if you don't call skipWaiting() in your service worker.</Callout>
<h3 id="sw-activated-event">The activated event</h3>
<p>The very first time a service worker finishes activating it may (or may not) have started controlling the page.</p>
<p>
  For this reason, you should not listen for the <ICD>activated</ICD> event as a way of knowing when the service worker is in control of the page. However,
  if you're running logic in the <ICD>activate</ICD> event (in the service worker), and you need to know when that logic is complete, the
  <ICD>activated</ICD> event will let you know that.
</p>
<h2 id="unexpected-sw-version">When an unexpected version of the service worker is found</h2>
<p>
  Sometimes users will keep your site open in a background tab for a very long time. They might even open a new tab and navigate to your site without
  realizing they already have your site open in a background tab. In such cases it's possible to have two versions of your site running at the same
  time, and that can present some interesting problems for you as the developer.
</p>
<p>
  Consider a scenario where you have tab A running v1 of your site and tab B running v2. When tab B loads, it'll be controlled by the version of your
  service worker that shipped with v1, but the page returned by the server (if using a network-first caching strategy for your navigation requests)
  will contain all your v2 assets.
</p>
<p>
  This is generally not a problem for tab B though, since when you wrote your v2 code, you were aware of how your v1 code worked. However, it could be
  a problem for tab A, since your v1 code could not have possibly predicted what changes your v2 code might introduce.
</p>
<p>
  To help handle these situations, the <ICD>Serwist</ICD> class also dispatches lifecycle events when it detects an update from an external service worker,
  where external just means any version that is not the version the current <ICD>Serwist</ICD> instance registered.
</p>
<p>
  The dispatched events are the same as the events documented above, with the addition of the <ICD>isExternal</ICD> property being set to
  <ICD>true</ICD>. If your web application needs to implement some logic to handle an external service worker, you can check for that property in your
  event handlers.
</p>
<h2 id="communication">Communication between the service worker and the window</h2>
<p>
  Most advanced service worker usage involves a lots of messaging between the service worker and the window. The <ICD>Serwist</ICD> class helps with this
  by providing the <ICD>messageSW()</ICD> method, which sends a message to the instance's registered service worker and waits for a response.
</p>
<p>While you can send data to the service worker in any format, the format used by Serwist is an object with three properties:</p>
<ul class="list">
  <li>
    <ICD>type</ICD> — A unique string used to identify this message. Serwist's <ICD>type</ICD> follows the <ICD>SCREAMING_SNAKECASE</ICD> naming convention.
    If a <ICD>type</ICD> represents an action to be taken, it should be a command in present tense (e.g. <ICD>CACHE_URLS</ICD>), if <ICD>type</ICD> represents
    some information being reported, it should be in past tense (e.g. <ICD>URLS_CACHED</ICD>).
  </li>
  <li>
    <ICD>meta</ICD> (optional) — In Serwist, this is always the name of the Serwist package sending the message with the prefixing at sign ("@") removed
    and all forward slashes ("/") replaced by hyphens ("-"). When sending a message yourself, you can either omit this property or set it to whatever you
    like.
  </li>
  <li>
    <ICD>payload</ICD> (optional) — The data being sent. Usually this is an object, but it does not have to be.
  </li>
</ul>
<p>
  The <ICD>messageSW()</ICD> method use <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel">
    <ICD>MessageChannel</ICD>
  </ExternalLink> so that the receiver can respond to them. To respond to a message sent by this method, you can call
  <ICD>event.ports[0].postMessage(response)</ICD> in your <ICD>message</ICD> event listener. The <ICD>messageSW()</ICD> method returns a promise that will
  resolve to whatever response you reply with.
</p>
<p>
  Here's an example of sending messages from the window to the service worker and getting a response back. The first code block is the
  <ICD>message</ICD> event listener in the service worker:
</p>
<CodeTab codes={data.code.examples.message.serviceWorker} defaultTab="sw.ts" />
<p>
  And the second block uses the <ICD>Serwist</ICD> class to send the message and wait for the response:
</p>
<CodeTab codes={data.code.examples.message.client} defaultTab="index.ts" />
<h3 id="sw-version-incompat">Managing version incompatibilities</h3>
<p>
  When you're sending messages back and forth between the window and the service worker, it's critical to be aware that your service worker might not
  be running the same version of your site that your page code is running, and the solution for dealing with this problem is different depending on
  whether your serving your pages network-first or cache-first.
</p>
<h4 id="sw-version-incompat-network-first">If you serve your pages network-first</h4>
<p>
  When serving your pages network-first, your users will get the latest version of your HTML from your server if they are not offline. When a user
  revisits your site for the first time after you've deployed an update, they will get the latest HTML, but the service worker running in their
  browser will be an outdated one.
</p>
<p>
  It's important to understand this because if the JavaScript loaded by the current version of your page sends a message to an older version of your
  service worker, that version may not know how to respond, or it may respond with an incompatible format.
</p>
<p>
  As a result, it is a good idea to version your service worker and check whether the service worker is compatible before doing any critical work.
</p>
<p>
  For example, in the code above, if the service worker version returned by that <ICD>messageSW()</ICD> call is older than the expected version, it would
  be wise to wait until an update is found (which should happen when you call <ICD>register()</ICD>). At that point you can either notify the user or
  an update, or you can manually skip the waiting phase to activate the new service worker right away.
</p>
<h4 id="sw-version-incompat-cache-first">If you serve your pages cache-first</h4>
<p>
  As opposed to when you serve pages network-first, you know that initially, your page is always going to be the same version as your service worker
  because that is what served the HTML. As a result, it's safe to use <ICD>messageSW()</ICD> right away.
</p>
<p>
  However, if an updated version of your service worker is found and activated right away (for example, when you call <ICD>skipWaiting()</ICD>), it
  may no longer be safe to send messages to it.
</p>
<p>
  One strategy for managing this possibility is to use a versioning scheme that allows you to differentiate between breaking updates and non-breaking
  updates, and in the case of a breaking update you'd know it's not safe to message the service worker. Instead you'd want to warn the user that
  they're running an old version of the page and suggest they reload to get the update.
</p>
