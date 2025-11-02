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

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');
  const [crpError, setCrpError] = useState('');

  const router = useRouter();

  function isValidCRP(crp: string): boolean {
    const regex = /^\d{2}\/\d{4,8}$/;
    return regex.test(crp);
  }

  const handleCrpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setCrp(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setApiError('');
    setNomeError('');
    setEmailError('');
    setSenhaError('');
    setConfirmarSenhaError('');
    setCrpError('');

    let isValid = true;
    if (nome.trim() === '') {
      setNomeError('Por favor, preencha seu nome.');
      isValid = false;
    }
    if (email.trim() === '') {
      setEmailError('Por favor, preencha o campo de email.');
      isValid = false;
    }
    if (senha.length < 8) {
      setSenhaError('A senha deve ter no mínimo 8 caracteres.');
      isValid = false;
    }
    if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem.');
      isValid = false;
    }
    if (role === 'psicologo') {
      if (!isValidCRP(crp)) {
        setCrpError('Formato de CRP inválido (ex: 06/123456).');
        isValid = false;
      }
    }
    if (!isValid) {
      setIsLoading(false);
      setApiError('Dados inválidos. Verifique os campos.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome,
          email: email,
          password: senha,
          confirmPassword: confirmarSenha,
          role: role.toUpperCase(),
          crp: crp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Dados inválidos. Verifique os campos.');
        if (data.details) {
          data.details.name?.forEach((err: string) => setNomeError(err));
          data.details.email?.forEach((err: string) => setEmailError(err));
          data.details.password?.forEach((err: string) => setSenhaError(err));
          data.details.confirmPassword?.forEach((err: string) => setConfirmarSenhaError(err));
          data.details.role?.forEach((err: string) => setApiError(err));
          data.details.crp?.forEach((err: string) => setCrpError(err));
        }
      } else {
        setApiError(data.message || 'Registro concluído! Verifique o seu email.');
      }
    } catch (error) {
      setApiError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccessMessage = apiError.startsWith('Registro') || apiError.startsWith('Email');

  return (
    <main className="public-page-wrapper signup-page">
      <div className="login-container">
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
          {apiError && <small style={{ color: isSuccessMessage ? 'green' : '#D93025', marginBottom: '15px', textAlign: 'center' }}>{apiError}</small>}
          
          <form id="cadastro-form" onSubmit={handleSubmit} noValidate>
            
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
              <label htmlFor="crp">CRP (ex: 06/123456)</label>
              <input
                type="text"
                id="crp"
                name="crp"
                value={crp}
                onChange={handleCrpChange}
                className={crpError ? 'error' : ''}
                maxLength={11}
              />
              <small id="crp-error" className="error-message">{crpError}</small>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Aguarde...' : 'Cadastrar'}
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