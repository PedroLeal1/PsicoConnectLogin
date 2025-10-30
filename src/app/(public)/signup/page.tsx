"use client";
import { useState } from "react";
export default function SignupPage(){
  const [msg,setMsg]=useState<string|null>(null),[loading,setLoading]=useState(false);
  async function handle(form: FormData){
    setLoading(true); setMsg(null);
    const payload = {
      name: form.get("name"), email: form.get("email"),
      password: form.get("password"), confirmPassword: form.get("confirmPassword"),
      role: form.get("role"),
    };
    const r = await fetch("/api/signup",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload)});
    const j = await r.json(); setLoading(false);
    setMsg(r.ok ? "Cadastro OK! Faça login." : (j.error ?? "Erro no cadastro"));
  }
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Criar conta</h1>
      <form action={handle} className="space-y-3">
        <input name="name" className="w-full border p-2 rounded" placeholder="Nome" required/>
        <input name="email" type="email" className="w-full border p-2 rounded" placeholder="Email" required/>
        <input name="password" type="password" className="w-full border p-2 rounded" placeholder="Senha (min. 6)" required/>
        <input name="confirmPassword" type="password" className="w-full border p-2 rounded" placeholder="Confirmar senha" required/>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="role" value="PSYCHOLOGIST" required/>Psicólogo(a)</label>
          <label className="flex items-center gap-2"><input type="radio" name="role" value="PATIENT" required/>Paciente</label>
        </div>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">{loading?"Enviando...":"Cadastrar"}</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
