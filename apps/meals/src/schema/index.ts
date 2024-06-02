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

export const recipies = pgTable(
    'recipies',
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

export const recipiesToingredients = pgTable(
    'recipies_to_ingredients',
    {
        recipyId: serial('recipy_id')
            .notNull()
            .references(() => recipies.id),
        ingredientId: serial('ingredient_id')
            .notNull()
            .references(() => ingredients.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.recipyId, t.ingredientId] }),
    }),
);

export const recipiesToCuisines = pgTable(
    'recipies_to_cuisines',
    {
        recipyId: serial('recipy_id')
            .notNull()
            .references(() => recipies.id),
        cuisineId: serial('cuisine_id')
            .notNull()
            .references(() => cuisines.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.recipyId, t.cuisineId] }),
    }),
);

export const usersRelations = relations(recipies, ({ many }) => ({
    recipiesToingredients: many(recipiesToingredients, {
        relationName: 'recipyToingredients',
    }),
    recipiesToCuisines: many(recipiesToCuisines, {
        relationName: 'recipyToCuisines',
    }),
}));

export const cuisineRelations = relations(cuisines, ({ many }) => ({
    recipiesToCuisines: many(recipiesToCuisines, {
        relationName: 'recipyToCuisines',
    }),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
    recipiesToingredients: many(recipiesToingredients, {
        relationName: 'recipyToingredients',
    }),
}));

export const insertRecipySchema = createInsertSchema(recipies);
export const selectRecipySchema = createSelectSchema(recipies);
export type NewRecipy = z.infer<typeof insertRecipySchema>;
export type Recipy = z.infer<typeof selectRecipySchema>;

export const insertingredientSchema = createInsertSchema(ingredients);
export const selectingredientSchema = createSelectSchema(ingredients);
export type Newingredient = z.infer<typeof insertingredientSchema>;
export type ingredient = z.infer<typeof selectingredientSchema>;

export const insertCuisineSchema = createInsertSchema(cuisines);
export const selectCuisineSchema = createSelectSchema(cuisines);
export type NewCuisine = z.infer<typeof insertCuisineSchema>;
export type Cuisine = z.infer<typeof selectCuisineSchema>;

export const insertRecipyToingredientSchema = createInsertSchema(recipiesToingredients);
export const selectRecipyToingredientSchema = createSelectSchema(recipiesToingredients);
export type NewRecipyToingredient = z.infer<typeof insertRecipyToingredientSchema>;
export type RecipyToingredient = z.infer<typeof selectRecipyToingredientSchema>;

export const insertRecipyToCuisineSchema = createInsertSchema(recipiesToCuisines);
export const selectRecipyToCuisineSchema = createSelectSchema(recipiesToCuisines);
export type NewRecipyToCuisine = z.infer<typeof insertRecipyToCuisineSchema>;
export type RecipyToCuisine = z.infer<typeof selectRecipyToCuisineSchema>;
