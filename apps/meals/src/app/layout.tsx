import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Navbar } from '@/components/hoc/navbar';
import { ThemeProvider } from '@/theme/provider';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

type RootLayoutProps = {
    children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
                    <div className="bg-background relative flex min-h-screen flex-col">
                        <Navbar />
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
