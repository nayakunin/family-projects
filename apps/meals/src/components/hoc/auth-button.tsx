'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const AuthButton = () => {
    const { data: session, status } = useSession();

    console.log(status);

    if (status === 'loading') return null;

    if (session) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback>{session.user?.name}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button size="sm" variant="outline" onClick={() => signIn()}>
            Sign In
        </Button>
    );
};
