import Image from "next/image";

const Page = () => (
  <main>
    <p id="welcome-text">This is a Next.js + Serwist PWA!</p>
    <Image src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
  </main>
);

export default Page;
