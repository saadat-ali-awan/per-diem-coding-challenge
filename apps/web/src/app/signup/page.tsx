'use client';
import { signUp } from '@/lib/api';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string| null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const tenant = document.cookie.split('; ').find(x=>x.startsWith('tenant='))?.split('=')[1];
    try {
      if (!tenant) throw new Error('Tenant not found');
      const res = await signUp(tenant, email, password);
      if (!res.success) throw new Error('Signup failed');
      window.location.href = '/';
    } catch (e: unknown | Error) {
      if (e instanceof Error) setError(e.message);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 text-black">
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
