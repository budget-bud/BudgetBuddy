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
      <body className="max-w-full w-screen bg-primary_100 text-tertiary_900">
        <main className="min-h-screen flex flex-row items-start w-full w-max-[1020px]">
          <ContextProvider>
            <Sidemenu />
            <div className="w-full min-h-screen max-h-screen flex flex-col items-center">
              <Header />
              <div className="w-full max-h-[calc(100vh-2.5rem)] flex flex-grow max-w-7xl p-3">
                {children}
              </div>
            </div>
          </ContextProvider>
        </main>
      </body>
    </html>
  );
}
