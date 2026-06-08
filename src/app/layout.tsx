import type { PropsWithChildren } from "react";
import "./globals.css";
import AppProviders from "@/components/AppProviders";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-br">
      <head>
        <title>PsicoConnect</title>
        <meta
          name="description"
          content="Plataforma de apoio à prática psicológica."
        />

        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Montserrat:wght@700&family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}