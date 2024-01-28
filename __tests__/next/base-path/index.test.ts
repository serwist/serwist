import { createDescribe } from "../utils/index.ts";

createDescribe("@serwist/next - basePath", { sourceDir: __dirname, skipInstall: false }, ({ next }) => {
  it("should render", async () => {
    const $ = await next.render("/serwist-app");
    expect($("#welcome-text").text()).toBe("This is a Next.js + Serwist PWA!");
  });

  it("should fetch image", async () => {
    const image = await next.fetch("/serwist-app/next.svg");
    expect(image.status).toBe(200);
    const favicon = await next.fetch("/serwist-app/favicon.ico");
    expect(favicon.status).toBe(200);
  });

  it("should be able to fetch service worker", async () => {
    const sw = await next.fetch("/serwist-app/sw.js");
    expect(sw.status).toBe(200);
    expect(sw.headers.get("Content-Type")?.includes("application/javascript")).toBe(true);
  });
});
