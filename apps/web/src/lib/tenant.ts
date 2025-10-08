'use server';
import { cookies, headers } from 'next/headers';

export async function getTenant() {
  const hdrs = await headers();
  const host = hdrs.get('host') || '';
  const [sub] = host.split('.');
  const cookieTenant = (await cookies()).get('tenant')?.value;
  return sub && sub !== 'localhost' ? sub : (cookieTenant ?? null);
}
