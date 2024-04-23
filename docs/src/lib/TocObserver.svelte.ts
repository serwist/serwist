import { BREAKPOINTS } from "./constants";
import type { TocEntry } from "./types";

export class TocObserver {
  observer: IntersectionObserver | null = null;

  constructor() {
    if (!("IntersectionObserver" in globalThis)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        let found = false;
        entries.forEach((entry) => {
          const link = document.querySelector(`a[href="#${entry.target.id}"]`);
          if (link === null) return;
          if (entry.intersectionRatio > 0) {
            link.classList.add("active");
            if (!found && window.innerWidth >= BREAKPOINTS.lg) {
              link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
              found = true;
            }
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
  observe(toc: TocEntry[] | undefined) {
    if (!toc || !this.observer) return;

    document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((elem) => this.observer?.observe(elem));
  }
  disconnect() {
    this.observer?.disconnect();
  }
}
