import "./globals.css";

export const metadata = {
  title: "WhyAmIBroke",
  description: "Personal spending tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}