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

export const fullnessEnum = pgEnum('fullness', ['low', 'medium', 'high']);

export const recipies = pgTable(
    'recipies',
    {
        id: serial('id').primaryKey(),
        title: varchar('title', { length: 256 }).notNull(),
        calories: integer('calories').notNull().default(0),
        fullness: fullnessEnum('fullness'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        heroPictureURL: varchar('hero_picture_url', { length: 256 }),
        content: text('content'),
        testChange: text('test_change'),
    },
    (t) => ({
        titleIndex: uniqueIndex('title_index').on(t.title),
    }),
);

export const ingridients = pgTable(
    'ingridients',
    {
        id: serial('id').primaryKey(),
        label: varchar('label', { length: 256 }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => ({
        ingridientLabelIndex: uniqueIndex('ingridient_label_index').on(t.label),
    }),
);

export const cuisines = pgTable(
    'cuisines',
    {
        id: serial('id').primaryKey(),
        label: varchar('label', { length: 256 }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => ({
        cuisineLabelIndex: uniqueIndex('cuisine_label_index').on(t.label),
    }),
);

export const recipiesToIngridients = pgTable(
    'recipies_to_ingridients',
    {
        recipyId: serial('recipy_id')
            .notNull()
            .references(() => recipies.id),
        ingridientId: serial('ingridient_id')
            .notNull()
            .references(() => ingridients.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.recipyId, t.ingridientId] }),
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
    recipiesToIngridients: many(recipiesToIngridients, {
        relationName: 'recipyToIngridients',
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

export const ingridientsRelations = relations(ingridients, ({ many }) => ({
    recipiesToIngridients: many(recipiesToIngridients, {
        relationName: 'recipyToIngridients',
    }),
}));

export const insertRecipySchema = createInsertSchema(recipies);
export const selectRecipySchema = createSelectSchema(recipies);
export type NewRecipy = z.infer<typeof insertRecipySchema>;
export type Recipy = z.infer<typeof selectRecipySchema>;

export const insertIngridientSchema = createInsertSchema(ingridients);
export const selectIngridientSchema = createSelectSchema(ingridients);
export type NewIngridient = z.infer<typeof insertIngridientSchema>;
export type Ingridient = z.infer<typeof selectIngridientSchema>;

export const insertCuisineSchema = createInsertSchema(cuisines);
export const selectCuisineSchema = createSelectSchema(cuisines);
export type NewCuisine = z.infer<typeof insertCuisineSchema>;
export type Cuisine = z.infer<typeof selectCuisineSchema>;

export const insertRecipyToIngridientSchema = createInsertSchema(recipiesToIngridients);
export const selectRecipyToIngridientSchema = createSelectSchema(recipiesToIngridients);
export type NewRecipyToIngridient = z.infer<typeof insertRecipyToIngridientSchema>;
export type RecipyToIngridient = z.infer<typeof selectRecipyToIngridientSchema>;

export const insertRecipyToCuisineSchema = createInsertSchema(recipiesToCuisines);
export const selectRecipyToCuisineSchema = createSelectSchema(recipiesToCuisines);
export type NewRecipyToCuisine = z.infer<typeof insertRecipyToCuisineSchema>;
export type RecipyToCuisine = z.infer<typeof selectRecipyToCuisineSchema>;
