import Link from 'next/link';

import { AuthButton } from './auth-button';

type NavbarLinks = {
    href: string;
    label: string;
}[];

const config: NavbarLinks = [
    {
        href: '/',
        label: 'Home',
    },
    {
        href: '/recipes/create',
        label: 'Create a Recipe',
    },
];

export const Navbar = () => {
    return (
        <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="container flex h-14 items-center justify-between">
                <nav className="flex items-center gap-4 text-sm">
                    {config.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="hover:text-foreground/80 text-foreground/60 transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <AuthButton />
                </div>
            </div>
        </header>
    );
};
