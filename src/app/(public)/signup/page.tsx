"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [role, setRole] = useState('paciente');
  const [crp, setCrp] = useState('');

  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');
  const [crpError, setCrpError] = useState('');
  
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isValidCRP(crp: string) {
    const regex = /^\d{2}\/\d{4,8}$/;
    return regex.test(crp);
  }

  const handleCrpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    let digits = value.replace(/\D/g, '');
    
    digits = digits.slice(0, 10);
    
    if (digits.length > 2) {
      digits = digits.slice(0, 2) + '/' + digits.slice(2);
    }

    setCrp(digits);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setApiError('');
    setNomeError('');
    setEmailError('');
    setSenhaError('');
    setConfirmarSenhaError('');
    setCrpError('');
    setIsLoading(true);

    let isValid = true;

    if (nome.trim() === '') {
      setNomeError('Por favor, preencha seu nome.');
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError('Por favor, preencha o campo de email.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um email válido (ex: email@dominio.com).');
      isValid = false;
    }

    if (senha.trim() === '') {
      setSenhaError('Por favor, preencha o campo de senha.');
      isValid = false;
    } else if (senha.length < 8) {
      setSenhaError('A senha deve ter no mínimo 8 caracteres.');
      isValid = false;
    }

    if (confirmarSenha.trim() === '') {
      setConfirmarSenhaError('Por favor, confirme sua senha.');
      isValid = false;
    } else if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem.');
      isValid = false;
    }

    if (role === 'psicologo') {
      if (crp.trim() === '') {
        setCrpError('Por favor, preencha seu CRP.');
        isValid = false;
      } else if (!isValidCRP(crp)) {
        setCrpError('Formato de CRP inválido. Use (ex: 06/12345).');
        isValid = false;
      }
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, confirmarSenha, role, crp }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setApiError(data.error);
        } else if (res.status === 400) {
          setApiError('Dados inválidos. Verifique os campos.');
          if (data.details?.email) setEmailError(data.details.email[0]);
          if (data.details?.nome) setNomeError(data.details.nome[0]);
          if (data.details?.password) setSenhaError(data.details.password[0]);
          if (data.details?.confirmPassword) setConfirmarSenhaError(data.details.confirmPassword[0]);
          if (data.details?.crp) setCrpError(data.details.crp[0]);
        } else {
          setApiError('Erro ao criar conta. Tente novamente.');
        }
      } else {
        alert('Cadastro realizado com sucesso! Redirecionando para o login...');
        router.push('/login');
      }
    } catch (error) {
      setApiError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="public-page-wrapper">
      <div className="login-container signup-page">
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
          <h2>Criar Conta</h2>
          <form id="cadastro-form" onSubmit={handleSubmit} noValidate>
            
            {apiError && (
              <small style={{ color: '#D93025', marginBottom: '10px', textAlign: 'center' }}>
                {apiError}
              </small>
            )}

            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={nomeError ? 'error' : ''}
              required
            />
            <small id="nome-error" className="error-message">{nomeError}</small>

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'error' : ''}
              required
            />
            <small id="email-error" className="error-message">{emailError}</small>

            <label htmlFor="senha">Senha (mín. 8 caracteres)</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={senhaError ? 'error' : ''}
              required
            />
            <small id="senha-error" className="error-message">{senhaError}</small>

            <label htmlFor="confirmar-senha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmar-senha"
              name="confirmar-senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className={confirmarSenhaError ? 'error' : ''}
              required
            />
            <small id="confirmar-senha-error" className="error-message">{confirmarSenhaError}</small>

            <label>Você é:</label>
            <div className="role-selector">
              <input
                type="radio"
                id="role-paciente"
                name="role"
                value="paciente"
                checked={role === 'paciente'}
                onChange={(e) => setRole(e.target.value)}
              />
              <label htmlFor="role-paciente" className="radio-label">Paciente</label>
              
              <input
                type="radio"
                id="role-psicologo"
                name="role"
                value="psicologo"
                checked={role === 'psicologo'}
                onChange={(e) => setRole(e.target.value)}
              />
              <label htmlFor="role-psicologo" className="radio-label">Psicólogo</label>
            </div>

            <div id="crp-field" className={role === 'psicologo' ? 'hidden-field visible' : 'hidden-field'}>
              <label htmlFor="crp">CRP (Conselho Regional de Psicologia)</label>
              <input
                type="text"
                id="crp"
                name="crp"
                value={crp}
                onChange={handleCrpChange}
                className={crpError ? 'error' : ''}
                placeholder="00/00000"
                maxLength={11}
              />
              <small id="crp-error" className="error-message">{crpError}</small>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="separator">ou</div>

          <Link href="/login" className="btn-secondary">
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </main>
  );
}

