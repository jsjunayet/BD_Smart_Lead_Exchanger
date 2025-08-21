import Sidebar from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/share/Navbar";

import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <Navbar />
          <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
              <div className="max-w-full">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
