// Ficheiro: src/components/EmailTemplate.tsx

import * as React from 'react';

interface EmailTemplateProps {
  confirmLink: string;
}

export function EmailTemplate({ confirmLink }: EmailTemplateProps): React.ReactElement {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h1 style={{ color: '#001E5E' }}>Bem-vindo ao PsicoConnect!</h1>
      <p>Obrigado por se registrar. Por favor, confirme o seu email clicando no link abaixo:</p>
      <a 
        href={confirmLink}
        style={{
          display: 'inline-block',
          padding: '12px 20px',
          margin: '20px 0',
          backgroundColor: '#528CFF',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
      >
        Confirmar o meu Email
      </a>
      <p>Se não se registrou nesta plataforma, pode ignorar este email.</p>
      <p>Atenciosamente,<br />Equipe PsicoConnect</p>
    </div>
  );
}