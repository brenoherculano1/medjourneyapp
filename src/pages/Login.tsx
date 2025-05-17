import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      window.location.reload(); // recarrega o app pra entrar
    } catch (error: any) {
      setErro("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          className="border p-2"
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
          className="border p-2"
        />
        {erro && <p className="text-red-600">{erro}</p>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
