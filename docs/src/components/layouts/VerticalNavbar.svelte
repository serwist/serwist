<script lang="ts">
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  import { page } from "$app/stores";
  import { clsx } from "$lib/clsx";
  import { GITHUB_REPO_URL } from "$lib/constants";
  import { isLinkActive } from "$lib/isLinkActive";

  import { NAV_LINKS } from "./navbar-constants";
  import NavLink from "./NavLink.svelte";
  import NavToggleScheme from "./NavToggleScheme.svelte";

  const links = $derived(
    NAV_LINKS.map(({ link, ...rest }) => ({
      link,
      ...rest,
      isActive: isLinkActive(link, $page.url.pathname),
    }))
  );

  let isNavMobileMenuOpened = $state(false);

  $effect(() => {
    $page.url.pathname;
    isNavMobileMenuOpened = false;
  });
</script>

<nav class="z-[50] h-fit max-h-dvh transition-colors-opacity duration-100">
  <div class="mx-auto max-w-7xl">
    <div class="relative flex justify-between flex-row md:flex-col">
      <div class="flex md:block items-center md:items-start gap-2 md:py-2">
        <input
          type="checkbox"
          id="navbar-mobile-menu-toggle"
          class="hidden"
          aria-labelledby="navbar-mobile-menu-toglab"
          aria-expanded={isNavMobileMenuOpened}
          aria-controls="navbar-mobile-menu"
          bind:checked={isNavMobileMenuOpened}
        />
        <label
          id="navbar-mobile-menu-toglab"
          for="navbar-mobile-menu-toggle"
          class={clsx(
            "flex h-[2rem] w-[2rem] cursor-pointer flex-col justify-center gap-[0.5rem] md:hidden",
            "[&>span]:bg-black [&>span]:transition-all [&>span]:dark:bg-white",
            "[&>span]:h-[0.2rem] [&>span]:w-full [&>span]:rounded-md",
            isNavMobileMenuOpened && [
              "[&>:nth-child(1)]:rotate-45",
              "[&>:nth-child(1)]:translate-y-[0.7rem]",
              "[&>:nth-child(2)]:opacity-0",
              "[&>:nth-child(3)]:-translate-y-[0.7rem]",
              "[&>:nth-child(3)]:-rotate-45",
            ]
          )}
          aria-label="Toggle navbar menu"
        >
          <span class="origin-center duration-300" />
          <span class="duration-200 ease-out" />
          <span class="origin-center duration-300" />
        </label>
        <a href="/" aria-label="Go to home">
          <enhanced:img
            src="$images/logo-200x50-transparent.png"
            alt="Serwist"
            class="invert dark:invert-0 w-[100px] h-auto"
          />
        </a>
      </div>
      <div
        class="right-0 flex h-full w-fit gap-[5px] md:static md:w-full flex-col"
      >
        <div class="hidden h-full grow overflow-x-hidden pr-2 md:flex md:pr-0">
          <div
            class="overflow-x-overlay hidden h-full grow flex-row gap-[5px] overflow-x-auto md:flex"
          >
            <ul
              class="w-full flex max-h-full overflow-y-auto gap-[inherit] flex-col"
            >
              {#each links as { label, link, isActive }}
                <li class="w-full">
                  <NavLink href={link} textCenter={false} {isActive}
                    >{label}</NavLink
                  >
                </li>
              {/each}
            </ul>
          </div>
        </div>
        <div class="flex flex-row-reverse gap-[5px] items-center md:flex-row">
          <a
            class="nav-button"
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Our Github repo (opens in a new tab)"
          >
            <svg
              width={24}
              height={24}
              fill="currentColor"
              viewBox="3 3 18 18"
              aria-hidden
            >
              <title>GitHub</title>
              <path
                d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"
              />
            </svg>
          </a>
          <NavToggleScheme />
        </div>
      </div>
    </div>
  </div>
  {#if isNavMobileMenuOpened}
    <ul
      class="space-y-1 px-2 pb-3 pt-2 md:hidden"
      id="navbar-mobile-menu"
      transition:slide={{ duration: 200, easing: quintOut, axis: "y" }}
    >
      {#each links as { label, link, isActive }}
        <li>
          <NavLink href={link} textCenter={false} {isActive}>{label}</NavLink>
        </li>
      {/each}
    </ul>
  {/if}
</nav>
