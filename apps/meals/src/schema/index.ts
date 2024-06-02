import { relations } from 'drizzle-orm';
import {
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const fullnessOptions = ['low', 'medium', 'high'] as const;
export type FullnessOption = (typeof fullnessOptions)[number];
export const fullnessEnum = pgEnum('fullness', fullnessOptions);

export const recipes = pgTable(
    'recipes',
    {
        id: serial('id').primaryKey(),
        title: varchar('title', { length: 256 }).notNull(),
        calories: integer('calories').notNull().default(0),
        fullness: fullnessEnum('fullness').notNull().default('medium'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        heroPictureURL: varchar('hero_picture_url', { length: 256 }),
        content: text('content').notNull().default(''),
    },
    (t) => ({
        titleIndex: uniqueIndex('title_index').on(t.title),
    }),
);

export const ingredients = pgTable(
    'ingredients',
    {
        id: serial('id').primaryKey(),
        label: varchar('label', { length: 256 }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => ({
        ingredientLabelIndex: uniqueIndex('ingredient_label_index').on(t.label),
    }),
);

export const cuisines = pgTable(
    'cuisines',
    {
        id: serial('id').primaryKey(),
        label: varchar('label', { length: 256 }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => ({
        cuisineLabelIndex: uniqueIndex('cuisine_label_index').on(t.label),
    }),
);

export const recipesToingredients = pgTable(
    'recipes_to_ingredients',
    {
        recipeId: serial('recipe_id')
            .notNull()
            .references(() => recipes.id),
        ingredientId: serial('ingredient_id')
            .notNull()
            .references(() => ingredients.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.recipeId, t.ingredientId] }),
    }),
);

export const recipesToCuisines = pgTable(
    'recipes_to_cuisines',
    {
        recipeId: serial('recipe_id')
            .notNull()
            .references(() => recipes.id),
        cuisineId: serial('cuisine_id')
            .notNull()
            .references(() => cuisines.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.recipeId, t.cuisineId] }),
    }),
);

export const recipesRelations = relations(recipes, ({ many }) => ({
    recipesToingredients: many(recipesToingredients, {
        relationName: 'recipeToingredients',
    }),
    recipesToCuisines: many(recipesToCuisines, {
        relationName: 'recipeToCuisines',
    }),
}));

export const cuisineRelations = relations(cuisines, ({ many }) => ({
    recipesToCuisines: many(recipesToCuisines, {
        relationName: 'recipeToCuisines',
    }),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
    recipesToingredients: many(recipesToingredients, {
        relationName: 'recipeToingredients',
    }),
}));

export const insertRecipeSchema = createInsertSchema(recipes);
export const selectRecipeSchema = createSelectSchema(recipes);
export type NewRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = z.infer<typeof selectRecipeSchema>;

export const insertingredientSchema = createInsertSchema(ingredients);
export const selectingredientSchema = createSelectSchema(ingredients);
export type Newingredient = z.infer<typeof insertingredientSchema>;
export type ingredient = z.infer<typeof selectingredientSchema>;

export const insertCuisineSchema = createInsertSchema(cuisines);
export const selectCuisineSchema = createSelectSchema(cuisines);
export type NewCuisine = z.infer<typeof insertCuisineSchema>;
export type Cuisine = z.infer<typeof selectCuisineSchema>;

export const insertRecipeToingredientSchema = createInsertSchema(recipesToingredients);
export const selectRecipeToingredientSchema = createSelectSchema(recipesToingredients);
export type NewRecipeToingredient = z.infer<typeof insertRecipeToingredientSchema>;
export type RecipeToingredient = z.infer<typeof selectRecipeToingredientSchema>;

export const insertRecipeToCuisineSchema = createInsertSchema(recipesToCuisines);
export const selectRecipeToCuisineSchema = createSelectSchema(recipesToCuisines);
export type NewRecipeToCuisine = z.infer<typeof insertRecipeToCuisineSchema>;
export type RecipeToCuisine = z.infer<typeof selectRecipeToCuisineSchema>;
