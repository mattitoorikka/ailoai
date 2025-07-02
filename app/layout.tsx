import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import LayoutWithAssistantId from "./LayoutWithAssistantId";  

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solmio Ailo™",
  description: "Solmio Ailo Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <LayoutWithAssistantId>{children}</LayoutWithAssistantId>
        </UserProvider>
      </body>
    </html>
  );
}
