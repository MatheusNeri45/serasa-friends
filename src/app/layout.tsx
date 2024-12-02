import type { Metadata } from "next";
import ThemeRegistry from "./components/theme-registry";

export const metadata: Metadata = {
  title: "Serasa friends",
  description: "Dando calote nos seus amigos de forma consciente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}