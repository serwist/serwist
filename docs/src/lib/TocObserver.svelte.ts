import { browser } from "$app/environment";
import { BREAKPOINTS } from "./constants";

export class TocObserver {
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (!(browser && "IntersectionObserver" in globalThis)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        // let found = false;
        entries.forEach((entry) => {
          const link = document.querySelector(`a[href="#${entry.target.id}"]`);
          if (link === null) return;
          if (entry.intersectionRatio > 0) {
            link.classList.add("active");
            // if (!found && window.innerWidth >= BREAKPOINTS.lg) {
            // link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            // found = true;
            // }
          } else {
            link.classList.remove("active");
          }
        });
      },
      {
        rootMargin: "0% 0% 0% 0%",
      },
    );
  }
  observe(element: Element) {
    this.observer?.observe(element);
  }
  unobserve(element: Element) {
    this.observer?.unobserve(element);
  }
  disconnect() {
    this.observer?.disconnect();
  }
}
