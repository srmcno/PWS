import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'PWS Asset Management | Choctaw Nation Sustainable Communities',
  description: 'Public Water Systems Asset Management Application for the Choctaw Nation Sustainable Communities Program',
  keywords: ['water systems', 'asset management', 'Choctaw Nation', 'sustainable communities', 'public water'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-0 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
                {children}
              </div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
