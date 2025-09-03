---
"@serwist/turbopack": minor
---
<!-- Delete on release -->
feat(turbo/preview): allow configuring `esbuild` instance

- You can now configure `@serwist/turbopack`'s `esbuild` instance. For example, to output the service worker in the `iife` format and disable sourcemaps:

```tsx
// app/serwist/[path]/route.ts
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "app/sw.ts",
  basePath: "/",
  esbuildOptions: {
    sourcemaps: false,
    format: "iife",
    define: {
      "import.meta": "{}",
    },
  },
});

// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <SerwistProvider swUrl="/serwist/sw.js" options={{ type: "classic" }}>{children}</SerwistProvider>
      </body>
    </html>
  );
}
```