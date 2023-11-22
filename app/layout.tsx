import "./globals.css";
import Header from "@/components/Header";
import Sidemenu from "@/components/Sidemenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-full w-screen bg-primary_100 text-tertiary_900">
        <main className="min-h-screen flex flex-row items-start w-full w-max-[1020px]">
          <Sidemenu />
          <div className="w-full flex flex-col">
            <Header />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
