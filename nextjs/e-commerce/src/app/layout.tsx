import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
