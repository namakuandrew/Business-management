import "./globals.css";
import ToastProvider from "@/component/ToastProvider";

export const metadata = {
  title: "Accounting Dashboard",
  description: "A modern accounting dashboard built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
