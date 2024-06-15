import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { getServerSession } from '@/auth/helpers';
import { Navbar } from '@/components/hoc/navbar';
import { SessionProvider } from '@/lib/session-provider';
import { ThemeProvider } from '@/theme/provider';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

type RootLayoutProps = {
    children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
    const session = await getServerSession();

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
                        <div className="bg-background relative flex min-h-screen flex-col">
                            <Navbar />
                            {children}
                        </div>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
