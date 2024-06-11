import '@radix-ui/themes/styles.css';
import '@/styles/global.css';

import { Reset, Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';

import { Providers } from './providers';

export const metadata = {
    title: 'Anki Deck Generator',
    description: 'Generate Anki decks using chat gpt',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <ThemeProvider attribute="class">
                        <Theme>
                            <Reset>{children}</Reset>
                        </Theme>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
