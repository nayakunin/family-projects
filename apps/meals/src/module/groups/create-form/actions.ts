'use server';

import invariant from 'tiny-invariant';

import { Auth } from '@/auth';
import { GroupRole, groups, Permission, userGroupPermissions, userGroups } from '@/schema';
import { db } from '@/server/db';

export const saveGroup = async ({
    name,
    users,
}: {
    name: string;
    users: {
        id: string;
        role: GroupRole;
        permissions: Permission[];
    }[];
}) => {
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
            users.map((user) => ({
                userId: user.id,
                groupId: group.id,
                role: user.role,
            })),
        );

        await tx.insert(userGroupPermissions).values(
            users.flatMap((user) =>
                user.permissions.map((permission) => ({
                    userId: user.id,
                    groupId: group.id,
                    permission,
                })),
            ),
        );
    });
};
