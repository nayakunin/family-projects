'use server';

import { and, eq, like, notInArray } from 'drizzle-orm';

import { groups, users } from '@/schema';
import { db } from '@/server/db';

export const validateGroupName = async (name: string) => {
    const result = await db.select({ id: groups.id }).from(groups).where(eq(groups.name, name));

    return result.length === 0;
};

export const findUsers = async (email: string, existingUserIds: string[]) => {
    return db
        .select({ id: users.id, name: users.name, image: users.image, email: users.email })
        .from(users)
        .where(
            and(
                like(users.email, `%${email.toLowerCase()}%`),
                notInArray(users.id, existingUserIds),
            ),
        )
        .limit(5);
};
