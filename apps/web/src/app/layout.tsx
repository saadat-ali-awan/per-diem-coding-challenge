import './globals.css';
import { fetchStore } from '@/lib/api';
import NotFound from './not-found';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let store: Awaited<ReturnType<typeof fetchStore>> | null = null;
  try { store = await fetchStore(); } catch { /* show neutral fallback */ }

  const theme = store?.theme || {};
  const style = {
    '--color-primary': theme.primary ?? '#3b82f6',
    '--color-bg':      theme.background ?? '#ffffff',
    '--font-family':   theme.fontFamily ?? 'Inter, system-ui',
  } as React.CSSProperties;

  return (
    <html lang="en">
      <body style={style}>
        <div className="min-h-screen" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
          {store ? children : <NotFound issue='Store Not Found' relatedTo='store' />}
        </div>
      </body>
    </html>
  );
}
