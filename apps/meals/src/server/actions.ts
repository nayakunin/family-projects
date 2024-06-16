'use server';
import { and, eq, ilike } from 'drizzle-orm';

import { Auth } from '@/auth';
import {
    GroupRole,
    groups,
    ingredients,
    NewRecipe,
    Permission,
    recipes,
    recipesToingredients,
    userGroupPermissions,
    userGroups,
    users,
} from '@/schema';

import { db } from './db';

export const getIngredients = async (filter: string) => {
    return db
        .select()
        .from(ingredients)
        .where(ilike(ingredients.label, `%${filter}%`));
};

export const getCuisines = async (filter: string) => {
    return db
        .select()
        .from(ingredients)
        .where(ilike(ingredients.label, `%${filter}%`));
};

export const createRecipe = async ({
    cuisines,
    ingredients,
    recipe,
}: {
    recipe: NewRecipe;
    ingredients: number[];
    cuisines: number[];
}) => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return await db.transaction(async (tx) => {
        const newRecipe = await tx
            .insert(recipes)
            .values({
                createdBy: session.user.id,
                title: recipe.title,
                calories: recipe.calories,
                fullness: recipe.fullness,
                content: recipe.content,
            })
            .returning();

        const id = newRecipe[0]?.id;

        if (!id) {
            await tx.rollback();
            return;
        }

        if (ingredients.length) {
            await tx.insert(recipesToingredients).values(
                ingredients.map((ingredient) => ({
                    recipeId: id,
                    ingredientId: ingredient,
                })),
            );
        }

        if (cuisines.length) {
            await tx.insert(recipesToingredients).values(
                cuisines.map((cuisine) => ({
                    recipeId: id,
                    cuisineId: cuisine,
                })),
            );
        }

        return id;
    });
};

export type GroupOptions = {
    name: string;
};

export const createGroup = async ({ name }: GroupOptions) => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return db.insert(groups).values({ name, ownerId: session.user.id }).returning();
};

export type AssignUserToGroupOptions = {
    groupId: string;
    userId: string;
    role?: GroupRole;
};

export const assignUserToGroup = async ({ groupId, userId, role }: AssignUserToGroupOptions) => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return await db.transaction(async (tx) => {
        const res = await tx
            .select()
            .from(groups)
            .where(and(eq(groups.id, groupId), eq(groups.ownerId, session.user.id)))
            .limit(1);

        if (!res || res.length === 0) {
            await tx.rollback();
            throw new Error('Group not found');
        }

        await tx.insert(userGroups).values({ groupId, userId, role });
    });
};

export type RemoveUserFromGroupOptions = {
    groupId: string;
    userId: string;
};

export const removeUserFromGroup = async ({ groupId, userId }: RemoveUserFromGroupOptions) => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return await db.transaction(async (tx) => {
        const res = await tx
            .select()
            .from(groups)
            .where(and(eq(groups.id, groupId), eq(groups.ownerId, session.user.id)))
            .limit(1);

        if (!res || res.length === 0) {
            await tx.rollback();
            throw new Error('Group not found');
        }

        await tx
            .delete(userGroups)
            .where(and(eq(userGroups.groupId, groupId), eq(userGroups.userId, userId)));
        await tx
            .delete(userGroupPermissions)
            .where(
                and(
                    eq(userGroupPermissions.userId, userId),
                    eq(userGroupPermissions.groupId, groupId),
                ),
            );
    });
};

type UpdatePermissionsOptions = {
    groupId: string;
    userId: string;
    permissions: Permission[];
};

export const updatePermissions = async ({
    groupId,
    userId,
    permissions,
}: UpdatePermissionsOptions) => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return await db.transaction(async (tx) => {
        const res = await tx
            .select()
            .from(groups)
            .where(and(eq(groups.id, groupId), eq(groups.ownerId, session.user.id)))
            .limit(1);

        if (!res || res.length === 0) {
            await tx.rollback();
            throw new Error('Group not found');
        }

        await tx
            .delete(userGroupPermissions)
            .where(
                and(
                    eq(userGroupPermissions.groupId, groupId),
                    eq(userGroupPermissions.userId, userId),
                ),
            );

        await tx
            .insert(userGroupPermissions)
            .values(permissions.map((permission) => ({ groupId, userId, permission })));
    });
};

export const getGroupUsers = async (groupId: string) => {
    return db.select().from(userGroups).where(eq(userGroups.groupId, groupId));
};

export const getCurrentUser = async () => {
    const session = await Auth.auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    const res = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    if (!res || res.length === 0 || !res[0]) {
        throw new Error('User not found');
    }

    return res[0];
};
