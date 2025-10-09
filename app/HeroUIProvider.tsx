"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { HeroUIProvider } from "@heroui/react";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

interface AppProps {
  children: React.ReactNode;
}

function App({ children }: Readonly<AppProps>) {
  // 2. Wrap HeroUIProvider at the root of your app
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export default App;
