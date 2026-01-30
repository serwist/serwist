import { createDescribe } from "@serwist-tests/next/utils";
import { expect, it } from "vitest";

createDescribe("@serwist/turbopack - basePath", { sourceDir: __dirname, turbo: true, skipInstall: false }, ({ next, testMode }) => {
  it("should render", async () => {
    const $ = await next.render("/serwist-app");
    expect($("#welcome-text").text()).toBe("This is a Next.js + Serwist PWA!");
  });

  it("should fetch image", async () => {
    const image = await next.fetch("/serwist-app/next.svg");
    expect(image.status).toBe(200);
    expect(image.headers.get("Content-Type")?.includes("image/svg+xml")).toBe(true);
    const favicon = await next.fetch("/serwist-app/favicon.ico");
    expect(favicon.status).toBe(200);
    expect(favicon.headers.get("Content-Type")?.includes("image/x-icon")).toBe(true);
  });

  it("should be able to fetch service worker", async () => {
    const sw = await next.fetch("/serwist-app/serwist/sw.js");
    expect(sw.status).toBe(200);
    expect(sw.headers.get("Content-Type")?.includes("application/javascript")).toBe(true);
    const swContent = await sw.text();
    if (testMode === "start") {
      expect(swContent.includes('url:"/serwist-app/next.svg"')).toBe(true);
      expect(swContent.includes('url:"/serwist-app/serwist/sw.js"')).toBe(false);
      expect(swContent.includes('url:"/serwist-app/_next/../public/sw.js"')).toBe(false);
    }
  });
});
