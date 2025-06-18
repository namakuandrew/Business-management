import "./globals.css";

export const metadata = {
  title: "Accounting Dashboard",
  description: "A modern accounting dashboard built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    // We pass the font variable to the html tag
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
