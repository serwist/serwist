<script lang="ts">
  import { page } from "$app/stores";
  import GitHubLogo from "$components/icons/GitHubLogo.svelte";
  import { clsx } from "$lib/clsx";
  import { GITHUB_REPO_URL } from "$lib/constants";
  import { isLinkActive } from "$lib/isLinkActive";

  import { NAV_LINKS } from "./navbar-constants";
  import NavLink from "./NavLink.svelte";
  import NavToggleScheme from "./NavToggleScheme.svelte";

  let mobileMenu = $state<HTMLDetailsElement | undefined>(undefined);

  const links = $derived(
    NAV_LINKS.map(({ link, ...rest }) => ({
      link,
      ...rest,
      isActive: isLinkActive(link, $page.url.pathname),
    }))
  );

  $effect(() => {
    $page.url.pathname;
    if (mobileMenu) {
      mobileMenu.open = false;
    }
  });
</script>

<nav class="z-[50] h-fit transition-colors-opacity duration-100">
  <div class="relative flex justify-between flex-row md:flex-col mx-auto">
    <div class="flex md:block items-center md:items-start gap-2 md:py-2">
      <a href="/" aria-label="Go to home">
        <enhanced:img src="$images/logo-200x50-transparent.png" alt="Serwist" class="invert dark:invert-0 w-[100px] h-auto" />
      </a>
    </div>
    <div class="flex gap-[5px] flex-col md:flex-col-reverse">
      <div class="hidden h-full pr-2 md:flex md:pr-0">
        <div class="overflow-x-overlay hidden h-full grow flex-row gap-[5px] overflow-x-auto md:flex">
          <ul class="w-full flex max-h-[50dvh] overflow-y-auto gap-[inherit] flex-col">
            {#each links as { label, link, isActive }}
              <li class="w-full">
                <NavLink href={link} textCenter={false} {isActive}>
                  {label}
                </NavLink>
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div class="flex flex-row-reverse gap-[5px] items-center md:flex-row">
        <details bind:this={mobileMenu} class="details-anim relative ml-3 md:hidden" id="nav-mobile-menu">
          <summary
            class={clsx(
              "flex h-[2rem] w-[2rem] cursor-pointer flex-col justify-center gap-[0.5rem]",
              "[&>span]:bg-black [&>span]:transition-all [&>span]:dark:bg-white",
              "[&>span]:h-[0.2rem] [&>span]:w-full [&>span]:rounded-md"
            )}
            aria-label="Toggle navbar menu"
          >
            <span class="origin-center duration-300" />
            <span class="duration-200 ease-out" />
            <span class="origin-center duration-300" />
          </summary>
          <div class="w-[150px] md:hidden absolute right-0">
            <ul
              class="space-y-1 p-2 relative top-2 bg-white dark:bg-black rounded-[14px] border border-neutral-300 dark:border-gray-900 max-h-[60dvh] overflow-y-auto"
            >
              {#each links as { label, link, isActive }}
                <li>
                  <NavLink href={link} textCenter={false} {isActive}>
                    {label}
                  </NavLink>
                </li>
              {/each}
            </ul>
          </div>
        </details>
        <a class="nav-button" href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
          <GitHubLogo width={24} height={24} />
          <span class="sr-only">Our Github repo (opens in a new tab)</span>
        </a>
        <NavToggleScheme />
      </div>
    </div>
  </div>
</nav>
