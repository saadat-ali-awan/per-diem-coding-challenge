import { fetchStore } from '@/lib/api';

export default async function Home() {
  const store = await fetchStore();
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
        {store.name}
      </h1>
      {store.welcome && <p className="mt-2 text-gray-600">{store.welcome}</p>}
      <p className="mt-6" style={{ color: 'var(--color-primary)' }}>Tenant: <code>{store.subDomain}</code></p>
    </main>
  );
}
