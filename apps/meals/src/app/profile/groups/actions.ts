'use server';

import { eq } from 'drizzle-orm';

import { groups, User, userGroups } from '@/schema';
import { db } from '@/server/db';

export const getGroups = async (user: User) => {
    return await db
        .select({
            id: groups.id,
            name: groups.name,
        })
        .from(userGroups)
        .where(eq(userGroups.userId, user.id))
        .innerJoin(groups, eq(userGroups.groupId, groups.id));
};
