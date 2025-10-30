"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle(form: FormData) {
    setLoading(true);
    setMsg(null);

    const res = await signIn("credentials", {
      redirect: false,
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setLoading(false);

    if (res?.error) {
      setMsg("Credenciais inválidas");
      return;
    }

    // ✅ Depois do login, checa a sessão e decide rota
    const session = await fetch("/api/auth/session").then((r) => r.json());
    const role = session?.user?.role;

    if (role === "PSYCHOLOGIST") {
      router.push("/dashboard");
    } else if (role === "PATIENT") {
      router.push("/patient");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <form action={handle} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          required
        />
        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Entrando..." : "Login"}
        </button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
