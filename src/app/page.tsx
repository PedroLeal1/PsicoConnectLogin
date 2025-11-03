// Ficheiro: src/app/page.tsx

"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  
  const user = session?.user as any;
  const userRole = user?.role || 'Desconhecido';

  return (
    <div className="p-0">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Bem-vindo, {user?.name || 'Utilizador'}!
        </h1>
        <p className="text-lg text-indigo-600 mb-8">
          Este é o seu Painel de Controlo PsicoConnect.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-lg">
            <p className="font-semibold text-blue-800">Detalhes da Sua Conta</p>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 border-b pb-4">
            <span className="font-bold text-gray-600 w-24">Nome:</span>
            <span className="text-gray-800">{user?.name}</span>
          </div>
          <div className="flex items-center space-x-4 border-b pb-4">
            <span className="font-bold text-gray-600 w-24">Email:</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-bold text-gray-600 w-24">Função:</span>
            <span className={`font-extrabold px-3 py-1 rounded-full text-xs ${userRole === 'PATIENT' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
              {userRole === 'PATIENT' ? 'Paciente' : 'Psicólogo'}
            </span>
          </div>
        </div>

    </div>
  );
}