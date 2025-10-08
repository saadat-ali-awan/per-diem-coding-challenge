'use server';
import { getTenant } from './tenant';

export async function fetchStore() {
  const tenant = await getTenant();
  if (!tenant) throw new Error('Tenant missing');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/me`, {
    headers: { 'x-tenant': tenant },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed store fetch');
  return res.json() as Promise<{ id: string; subDomain: string; name: string; welcome?: string; theme: {
      primary: string;
      background: string;
      fontFamily: string;
    }
  }>;
}
