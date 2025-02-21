import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import HeroUIProvider from "@/app/HeroUIProvider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Drag 'n' Drop task manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-background text-foreground`}>
        <HeroUIProvider>
          <ToastContainer stacked />
          <Nav />
          <main>{children}</main>
        </HeroUIProvider>
      </body>
    </html>
  );
}
