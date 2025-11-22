import "./globals.css";
import { Inter } from "next/font/google";
import ClientWrapper from "./ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hapsaé Cleaning Services",
  description: "Your cleaning services app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientWrapper>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
