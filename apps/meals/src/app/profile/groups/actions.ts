'use server';

import { count, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { groups, User, userGroups } from '@/schema';
import { db } from '@/server/db';

const ug1 = alias(userGroups, 'ug1');
const ug2 = alias(userGroups, 'ug2');

export const getGroups = async (user: User) => {
    return await db
        .select({
            id: groups.id,
            name: groups.name,
            role: ug1.role,
            userCount: count(ug2.userId),
        })
        .from(groups)
        .innerJoin(ug1, eq(groups.id, ug1.groupId))
        .innerJoin(ug2, eq(groups.id, ug2.groupId))
        .where(eq(ug1.userId, user.id))
        .groupBy(groups.id, groups.name, ug1.role);
};

export type Group = Awaited<ReturnType<typeof getGroups>>[number];
