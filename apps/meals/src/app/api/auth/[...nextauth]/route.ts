import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { env } from '@/env';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
