import "./globals.css";
import "../styles/styles.css";
import Header from "@/components/Header";
import Sidemenu from "@/components/Sidemenu";
import { Metadata } from "next";
import ContextProvider from "@/components/ContextProvider";
export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "BudgetBuddy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-screen max-w-full bg-secondary-950 text-text-100">
        <main className="w-max-[1020px] flex min-h-screen w-full flex-row items-start">
          <ContextProvider>
            <Sidemenu />
            <div className="flex max-h-screen min-h-screen w-full flex-col items-center">
              <Header />
              <div className="flex max-h-[calc(100vh-2.5rem)] md:max-h-screen w-full max-w-7xl flex-grow p-3">
                {children}
              </div>
            </div>
          </ContextProvider>
        </main>
      </body>
    </html>
  );
}
