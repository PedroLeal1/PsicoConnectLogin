"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="landing-home">
      <section className="landing-hero-area">
        <header className="landing-topbar">
          <div className="landing-brand">
            <img
              src="/logo.png"
              alt="Logo PsicoConnect"
              className="landing-brand-logo"
            />
            <div className="landing-brand-text">
              <span>Psico</span>
              <span>Connect</span>
            </div>
          </div>

          <nav className="landing-menu">
            <a href="#inicio">Início</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#sobre">Sobre Nós</a>
          </nav>

          <Link href="/login" className="landing-login-btn">
            Entrar
          </Link>
        </header>

        <div id="inicio" className="landing-hero-content">
          <h1>
            Conecte-se
            <br />
            com a sua saúde
          </h1>

          <div className="landing-hero-buttons">
            <Link href="/signup?role=PATIENT" className="landing-main-btn">
              Sou Paciente
            </Link>

            <Link href="/signup?role=PSYCHOLOGIST" className="landing-main-btn">
              Sou Psicólogo
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-intro-section">
        <h2>Descubra como funciona!</h2>
        <p>
          Conecte-se à sua saúde mental de maneira simples, organizada e
          acessível.
        </p>
      </section>

      <section id="como-funciona" className="landing-cards-section">
        <div className="landing-card-block">
          <div className="landing-icon-circle">
            <i className="fa-regular fa-calendar-check"></i>
          </div>
          <h3>Para Pacientes</h3>
          <p>
            Encontre um profissional, organize seus atendimentos e acompanhe sua
            jornada com mais praticidade.
          </p>
          <ul>
            <li>Encontre seu profissional</li>
            <li>Agende sua consulta</li>
            <li>Tenha mais organização</li>
          </ul>
        </div>

        <div className="landing-card-block">
          <div className="landing-icon-circle">
            <i className="fa-solid fa-desktop"></i>
          </div>
          <h3>Comunicação</h3>
          <p>
            Facilite a interação entre psicólogo e paciente por meio de uma
            plataforma académica intuitiva.
          </p>
          <ul>
            <li>Centralização das informações</li>
            <li>Mais clareza na comunicação</li>
            <li>Experiência simples de usar</li>
          </ul>
        </div>

        <div className="landing-card-block">
          <div className="landing-icon-circle">
            <i className="fa-regular fa-clipboard"></i>
          </div>
          <h3>Para Psicólogos</h3>
          <p>
            Organize seus pacientes, acompanhe atendimentos e tenha uma visão
            mais clara da sua rotina profissional.
          </p>
          <ul>
            <li>Cadastre-se na plataforma</li>
            <li>Gerencie seus pacientes</li>
            <li>Otimize sua organização</li>
          </ul>
        </div>
      </section>

      <section id="sobre" className="landing-about-section">
        <div className="landing-about-content">
          <div className="landing-about-text">
            <span className="landing-section-tag">Sobre o projeto</span>
            <h2>PsicoConnect</h2>
            <p>
              O PsicoConnect é uma plataforma académica desenvolvida com foco em
              tecnologia e saúde mental, buscando aproximar pacientes e
              psicólogos por meio de uma experiência digital mais simples, clara
              e organizada.
            </p>
            <p>
              O projeto foi pensado para apoiar a comunicação, a organização de
              atendimentos e a modernização da experiência em contextos de
              cuidado e acompanhamento psicológico.
            </p>
          </div>

          <div className="landing-about-highlights">
            <div className="landing-highlight-box">
              <i className="fa-solid fa-user-doctor"></i>
              <span>Conexão entre pacientes e psicólogos</span>
            </div>

            <div className="landing-highlight-box">
              <i className="fa-solid fa-calendar-days"></i>
              <span>Mais organização da rotina de atendimentos</span>
            </div>

            <div className="landing-highlight-box">
              <i className="fa-solid fa-comments"></i>
              <span>Comunicação mais simples e centralizada</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer-bar">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <strong>PsicoConnect</strong>
            <span>Projeto académico de tecnologia e saúde mental.</span>
          </div>

          <div className="landing-footer-links">
            <a href="#inicio">Início</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#sobre">Sobre nós</a>
          </div>
        </div>

        <div className="landing-footer-copy">
          © 2025 PsicoConnect - Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}