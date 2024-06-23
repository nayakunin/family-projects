'use server';

import { and, eq, inArray, sql } from 'drizzle-orm';
import invariant from 'tiny-invariant';

import { GroupRole, groups, Permission, userGroupPermissions, userGroups, users } from '@/schema';
import { db } from '@/server/db';

export const getGroup = async (groupId: string) => {
    const res = await db
        .select({
            id: groups.id,
            name: groups.name,
            members: sql<
                {
                    id: string;
                    name: string;
                    email: string;
                    image: string | null;
                    role: GroupRole;
                    permissions: Permission[];
                }[]
            >`
                jsonb_agg(
                    jsonb_build_object(
                        'id', "user".id,
                        'name', "user".name,
                        'email', "user".email,
                        'image', "user".image,
                        'role', "userGroups".role,
                        'permissions', (
                            SELECT jsonb_agg("userGroupPermissions".permission)
                            FROM "userGroupPermissions"
                            WHERE "userGroupPermissions"."userId" = "user".id AND "userGroupPermissions"."groupId" = groups.id
                        )
                    )
                )
            `,
        })
        .from(groups)
        .innerJoin(userGroups, eq(groups.id, userGroups.groupId))
        .innerJoin(users, eq(userGroups.userId, users.id))
        .where(eq(groups.id, groupId))
        .groupBy(groups.id, groups.name);

    const group = res[0];
    invariant(group, 'Group not found');

    return group;
};

type Values = {
    name: string;
    users: {
        id: string;
        role: GroupRole;
        permissions: Permission[];
    }[];
};

export const saveGroup = async (values: Values, group: Awaited<ReturnType<typeof getGroup>>) => {
    const owner = values.users.find((user) => user.role === 'owner');
    invariant(owner, 'Owner not found');

    const prevOwner = group.members.find((member) => member.role === 'owner');
    invariant(prevOwner, 'Previous owner not found');

    let hasOwnerChanged = false;
    if (prevOwner.id !== owner.id) {
        hasOwnerChanged = true;
    }

    let hasNameChanged = false;
    if (group.name !== values.name) {
        hasNameChanged = true;
    }

    let newUsers = [] as Values['users'];
    let changedPermissionsUsers = [] as Values['users'];
    let changedRoleUsers = [] as Values['users'];
    for (const user of values.users) {
        const prevUser = group.members.find((member) => member.id === user.id);
        if (!prevUser) {
            newUsers.push(user);
            continue;
        }

        if (prevUser.permissions.join() !== user.permissions.join()) {
            changedPermissionsUsers.push(user);
        }

        if (prevUser.role !== user.role) {
            changedRoleUsers.push(user);
        }
    }

    let removedUsers = [] as typeof group.members;
    for (const prevUser of group.members) {
        const user = values.users.find((u) => u.id === prevUser.id);
        if (!user) {
            removedUsers.push(prevUser);
        }
    }

    await db.transaction(async (tx) => {
        if (hasNameChanged || hasOwnerChanged) {
            await tx
                .update(groups)
                .set({
                    ...(hasNameChanged ? { name: values.name } : {}),
                    ...(hasOwnerChanged ? { ownerId: owner.id } : {}),
                })
                .where(eq(groups.id, group.id))
                .returning({ id: groups.id });
        }

        if (newUsers.length) {
            await tx.insert(userGroups).values(
                newUsers.map((user) => ({
                    userId: user.id,
                    groupId: group.id,
                    role: user.role,
                })),
            );
        }

        if (removedUsers.length) {
            await tx.delete(userGroups).where(
                and(
                    eq(userGroups.groupId, group.id),
                    inArray(
                        userGroups.userId,
                        removedUsers.map((user) => user.id),
                    ),
                ),
            );
        }

        if (changedRoleUsers.length) {
            for (const user of changedRoleUsers) {
                await tx
                    .update(userGroups)
                    .set({ role: user.role })
                    .where(and(eq(userGroups.groupId, group.id), eq(userGroups.userId, user.id)));
            }
        }

        if (changedPermissionsUsers.length) {
            await tx.delete(userGroupPermissions).where(
                and(
                    eq(userGroupPermissions.groupId, group.id),
                    inArray(
                        userGroupPermissions.userId,
                        changedPermissionsUsers.map((user) => user.id),
                    ),
                ),
            );

            await tx.insert(userGroupPermissions).values(
                changedPermissionsUsers.flatMap((user) =>
                    user.permissions.map((permission) => ({
                        userId: user.id,
                        groupId: group.id,
                        permission,
                    })),
                ),
            );
        }
    });
};
