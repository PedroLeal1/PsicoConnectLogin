"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setApiError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setApiError('Email ou senha inválidos.');
        setIsLoading(false);
      } else if (result?.ok) {
        router.push('/dashboard'); 
      }
    } catch (error) {
      setApiError('Não foi possível conectar ao servidor. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <main className="public-page-wrapper">
      <div className="login-container login-page">
        <div className="login-panel-left">
          <div className="logo-container">
            <img src="/logo.png" alt="Logo PsicoConnect" className="logo-img" />
            <h1>Psico<br />Connect</h1>
          </div>
          <p className="tagline">
            Um espaço<br />seguro para sua<br />saúde mental.
          </p>
        </div>

        <div className="login-panel-right">
          <h2>Entrar</h2>
          <form id="login-form" onSubmit={handleSubmit} noValidate>
            
            {apiError && (
              <small style={{ color: '#D93025', marginBottom: '10px', textAlign: 'center' }}>
                {apiError}
              </small>
            )}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <small id="email-error" className="error-message"></small>

            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small id="senha-error" className="error-message"></small>

            <Link href="#" className="forgot-password">
              Esqueceu sua senha?
            </Link>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="separator">ou</div>

          <Link href="/signup" className="btn-secondary">
            Cadastrar-se
          </Link>
        </div>
      </div>
    </main>
  );
}

