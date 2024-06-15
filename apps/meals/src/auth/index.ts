import { DrizzleAdapter } from '@auth/drizzle-adapter';
import nextAuth, { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GitHubProvider from 'next-auth/providers/github';

import { env } from '@/env';
import { accounts, sessions, users, verificationTokens } from '@/schema';
import { db } from '@/server/db';

export const authOptions: AuthOptions = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }) as Adapter, // FIX: See issue https://github.com/nextauthjs/next-auth/issues/9493
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        },
    },
    session: {
        strategy: 'database',
    },
};

export const { handlers, auth, signIn, signOut } = nextAuth(authOptions);
