import './globals.css';
import { fetchStore } from '@/lib/api';
import NotFound from './not-found';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || headersList.get( "referer") || ''; // works in most cases
  const isCreateStoreRoute = pathname.includes('/create-store');

  let store: Awaited<ReturnType<typeof fetchStore>> | null = null;
  try {
    store = await fetchStore();
  } catch {
    /* swallow error, fallback below */
  }

  const theme = store?.theme;
  const style = {
    '--color-primary': theme?.primary ?? '#3b82f6',
    '--color-bg': theme?.background ?? '#ffffff',
    '--font-family': theme?.fontFamily ?? 'Inter, system-ui',
  } as React.CSSProperties;

  const shouldShowChildren = store || isCreateStoreRoute;

  return (
    <html lang="en">
      <body style={style}>
        <div
          className="min-h-screen"
          style={{
            background: 'var(--color-bg)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {shouldShowChildren ? (
            children
          ) : (
            <NotFound issue="Store Not Found" relatedTo="store" />
          )}
        </div>
      </body>
    </html>
  );
}
