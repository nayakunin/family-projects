'use server';

import { eq, like } from 'drizzle-orm';

import { Auth } from '@/auth';
import { groups, userGroups, users } from '@/schema';
import { db } from '@/server/db';

export const validateGroupName = async (name: string) => {
    const result = await db.select({ id: groups.id }).from(groups).where(eq(groups.name, name));

    return result.length === 0;
};

export const findUsers = async (name: string) => {
    return db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(like(users.name, `%${name}%`))
        .limit(5);
};

export const saveGroup = async (name: string, userIds: string[]) => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    await db.transaction(async (tx) => {
        const result = await tx
            .insert(groups)
            .values({ name, ownerId: session.user.id })
            .returning({ id: groups.id });

        const group = result[0];

        if (!group) {
            await tx.rollback();
            throw new Error('Failed to create group');
        }

        return await tx
            .insert(userGroups)
            .values(userIds.map((userId) => ({ userId, groupId: group.id })));
    });
};
