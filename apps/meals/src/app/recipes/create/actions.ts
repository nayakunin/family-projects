'use server';

import { eq } from 'drizzle-orm';

import { Auth } from '@/auth';
import { groups, userGroups } from '@/schema';
import { db } from '@/server/db';

export const getGroups = async () => {
    const session = await Auth.auth();
    if (!session) throw new Error('Unauthorized');

    return await db
        .select({
            id: groups.id,
            name: groups.name,
        })
        .from(userGroups)
        .where(eq(userGroups.userId, session.user.id))
        .innerJoin(groups, eq(userGroups.groupId, groups.id));
};
