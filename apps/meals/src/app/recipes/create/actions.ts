'use server';

import { eq } from 'drizzle-orm';

import { Auth } from '@/auth';
import { groups, recipes, recipesToingredients, userGroups } from '@/schema';
import { db } from '@/server/db';

import { FormValues } from './page';

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

export const createRecipe = async ({
    calories,
    content,
    cuisines,
    fullness,
    ingredients,
    title,
    group,
}: FormValues) => {
    const session = await Auth.auth();
    if (!session) throw new Error('Unauthorized');

    return await db.transaction(async (tx) => {
        const newRecipe = await tx
            .insert(recipes)
            .values({
                title,
                content,
                fullness,
                createdBy: session.user.id,
                calories: Number(calories),
                groupId: group.open ? group.id : null,
            })
            .returning();

        const id = newRecipe[0]?.id;

        if (!id) {
            await tx.rollback();
            return;
        }

        if (ingredients.selected.length) {
            await tx.insert(recipesToingredients).values(
                ingredients.selected.map((ingredient) => ({
                    recipeId: id,
                    ingredientId: ingredient,
                })),
            );
        }

        if (cuisines.selected.length) {
            await tx.insert(recipesToingredients).values(
                cuisines.selected.map((cuisine) => ({
                    recipeId: id,
                    cuisineId: cuisine,
                })),
            );
        }

        return id;
    });
};
