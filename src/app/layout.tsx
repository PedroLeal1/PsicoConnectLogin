"use client";

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';
import './globals.css';

function AuthGuard({ children }: PropsWithChildren) {
  const { status } = useSession();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const pathname = usePathname();

  const isPublicPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (status === 'loading') {
    return (
      <body className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg font-semibold text-blue-800">A carregar sessão...</div>
      </body>
    );
  }

  if (status === 'unauthenticated' && !isPublicPage) {
    redirect('/login');
  }

  if (status === 'authenticated' && isPublicPage) {
    redirect('/');
  }

  if (isPublicPage) {
    return <body>{children}</body>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <body>
      <div className="overlay" onClick={() => setIsSidebarVisible(false)}></div> 
      <div className="chat-container">
          <nav className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
              <div className="sidebar-header">
                  <div className="logo">
                      <img src="/logo.png" alt="Logo PsicoConnect" />
                  </div>
                  <h1>Psico<br />Connect</h1>
              </div>
              
              <div className="sidebar-nav">
                  <Link href="/" className={isActive('/') ? 'active' : ''}>
                      <i className="fa-solid fa-home"></i> Início
                  </Link>
                  <Link href="#" className={isActive('/consultas') ? 'active' : ''}>
                      <i className="fa-solid fa-calendar-alt"></i> Minhas Consultas
                  </Link>
                  <Link href="#" className={isActive('/conteudos') ? 'active' : ''}>
                      <i className="fa-solid fa-book-open"></i> Conteúdos
                  </Link>
                  <Link href="/chat" className={isActive('/chat') ? 'active' : ''}>
                      <i className="fa-solid fa-comments"></i> Chat
                  </Link>
              </div>
              <div className="sidebar-footer">
                  <button 
                      onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                      <i className="fa-solid fa-sign-out-alt"></i> Sair
                  </button>
              </div>
          </nav>

          <main className="chat-main">
              <button 
                  className="menu-toggle-button"
                  onClick={() => setIsSidebarVisible(true)}
              >
                  <i className="fa-solid fa-bars"></i>
              </button>
              {children}
          </main>
      </div>
    </body>
  );
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Montserrat:wght@700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <SessionProvider>
        <AuthGuard>
          {children}
        </AuthGuard>
      </SessionProvider>
    </html>
  );
}