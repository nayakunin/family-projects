'use server';

import { and, eq, like, notInArray } from 'drizzle-orm';
import invariant from 'tiny-invariant';

import { Auth } from '@/auth';
import { groups, userGroupPermissions, userGroups, users } from '@/schema';
import { db } from '@/server/db';

import { FormValues } from '.';

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

export const saveGroup = async ({ name, users }: FormValues) => {
    const session = await Auth.auth();
    invariant(session, 'Session not found');

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

        await tx.insert(userGroups).values(
            users.selected.map((user) => ({
                userId: user.id,
                groupId: group.id,
                role: user.role,
            })),
        );

        await tx.insert(userGroupPermissions).values(
            users.selected.flatMap((user) =>
                user.permissions.map((permission) => ({
                    userId: user.id,
                    groupId: group.id,
                    permission,
                })),
            ),
        );
    });
};
