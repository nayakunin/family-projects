'use server';

import { eq } from 'drizzle-orm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { Auth } from '@/auth';
import { groups, recipes, recipesToIngredients, userGroups } from '@/schema';
import { db } from '@/server/db';

import { FormValues } from './schema';

export const parseMarkdown = async (content: string) =>
    String(
        await unified()
            .use(remarkParse) // Convert into markdown AST
            .use(remarkRehype) // Transform to HTML AST
            .use(rehypeSanitize) // Sanitize HTML input
            .use(rehypeStringify) // Convert AST into serialized HTML
            .process(content),
    );

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
            await tx.insert(recipesToIngredients).values(
                ingredients.selected.map((ingredient) => ({
                    recipeId: id,
                    ingredientId: ingredient.id,
                })),
            );
        }

        if (cuisines.selected.length) {
            await tx.insert(recipesToIngredients).values(
                cuisines.selected.map((cuisine) => ({
                    recipeId: id,
                    cuisineId: cuisine,
                })),
            );
        }

        return id;
    });
};
