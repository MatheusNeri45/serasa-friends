import type { Metadata } from "next";
import ThemeRegistry from "./components/theme-registry";

export const metadata: Metadata = {
  title: "Simple Splitwise",
  description: "Split expenses easily",
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