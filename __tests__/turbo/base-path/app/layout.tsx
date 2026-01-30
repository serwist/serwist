import { SerwistProvider } from "./serwist";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head />
    <body>
      <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
    </body>
  </html>
);

export default RootLayout;
