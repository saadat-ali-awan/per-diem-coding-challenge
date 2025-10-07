'use client';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string| null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const tenant = document.cookie.split('; ').find(x=>x.startsWith('tenant='))?.split('=')[1];
    try {
      const res = await fetch(`${api}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(tenant ? { 'x-tenant': tenant } : {}) },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Signup failed');
      window.location.href = '/';
    } catch (e:any) {
      setError(e.message);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 rounded text-white" style={{ background: 'var(--color-primary)' }}>Sign up</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
