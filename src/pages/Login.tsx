import { useState } from "react";
import { login } from "../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Welcome back
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          type="email"
          required
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          className="w-full mb-6 p-3 border rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
