'use server';
import { ilike } from 'drizzle-orm';

import { ingredients, NewRecipe, recipes, recipesToingredients } from '@/schema';

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
    return await db.transaction(async (tx) => {
        const newRecipe = await tx
            .insert(recipes)
            .values({
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
