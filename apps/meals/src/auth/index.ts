import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { env } from '@/env';
import { accounts, sessions, users, verificationTokens } from '@/schema';
import { db } from '@/server/db';

export const authOptions: NextAuthConfig = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id as string;
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id as string,
                },
            };
        },
    },
    session: {
        strategy: 'database',
    },
};

export const Auth = NextAuth(authOptions);
