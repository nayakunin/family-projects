import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Auth } from './auth';

export async function middleware(request: NextRequest) {
    const session = await Auth.auth();

    if (!session) {
        return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/account/:path*', '/recipes/create/:path*', '/groups/create/:path*'],
};
