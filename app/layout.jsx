import "./globals.css";

export const metadata = {
  title: "Centrum Rentowności",
  description: "Analiza rentowności i planowanie tras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
