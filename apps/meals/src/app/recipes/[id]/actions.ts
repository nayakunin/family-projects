'use server';

import { eq, sql } from 'drizzle-orm';
import invariant from 'tiny-invariant';

import {
    cuisines,
    groups,
    ingredients,
    recipes,
    recipesToCuisines,
    recipesToIngredients,
} from '@/schema';
import { db } from '@/server/db';

export const getRecipe = async (id: string) => {
    const idNum = parseInt(id, 10);
    invariant(!isNaN(idNum), 'Invalid recipe ID');

    const result = await db
        .select({
            id: recipes.id,
            title: recipes.title,
            content: recipes.content,
            fullness: recipes.fullness,
            calories: recipes.calories,
            groupId: recipes.groupId,
            groupName: groups.name,
            heroPictureUrl: recipes.heroPictureURL,
            createdAt: recipes.createdAt,
            ingredients: sql<{ id: number; label: string }[]>`
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', "ingredients".id,
                            'label', "ingredients".label
                        )
                    ) FILTER (WHERE "ingredients".id IS NOT NULL),
                    '[]'
                )
            `,
            cuisines: sql<{ id: number; label: string }[]>`
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', "cuisines".id,
                            'label', "cuisines".label
                        )
                    ) FILTER (WHERE "cuisines".id IS NOT NULL),
                    '[]'
                )
            `,
        })
        .from(recipes)
        .leftJoin(recipesToIngredients, eq(recipesToIngredients.recipeId, recipes.id))
        .leftJoin(recipesToCuisines, eq(recipesToCuisines.recipeId, recipes.id))
        .leftJoin(ingredients, eq(recipesToIngredients.ingredientId, ingredients.id))
        .leftJoin(cuisines, eq(recipesToCuisines.cuisineId, cuisines.id))
        .leftJoin(groups, eq(recipes.groupId, groups.id))
        .where(eq(recipes.id, idNum))
        .groupBy(recipes.id, groups.name);

    const recipe = result[0];

    invariant(recipe, 'Recipe not found');
    return recipe;
};
