import { SerwistProvider } from "@serwist/next/react";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head />
    <body>
      <SerwistProvider swUrl="/sw.js">{children}</SerwistProvider>
    </body>
  </html>
);

export default RootLayout;
