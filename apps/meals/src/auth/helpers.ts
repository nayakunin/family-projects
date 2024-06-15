'use server';
import { getServerSession as naGetServerSession } from 'next-auth';

import { authOptions, signIn as naSignIn, signOut as naSignOut } from '.';

export async function signIn() {
    await naSignIn();
}

export async function signOut() {
    await naSignOut();
}

export async function getServerSession() {
    return await naGetServerSession(authOptions);
}
