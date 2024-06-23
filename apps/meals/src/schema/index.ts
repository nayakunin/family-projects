import { relations } from 'drizzle-orm';
import {
    boolean,
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

export const users = pgTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
});

export const accounts = pgTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    }),
);

export const sessions = pgTable('session', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    }),
);

export const authenticators = pgTable(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: boolean('credentialBackedUp').notNull(),
        transports: text('transports'),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    }),
);

export const permissions = ['read', 'write', 'delete'] as const;
export type Permission = (typeof permissions)[number];
export const permissionEnum = pgEnum('permission', permissions);

export const groupRoles = ['owner', 'member'] as const;
export type GroupRole = (typeof groupRoles)[number];
export const groupRoleEnum = pgEnum('groupRole', groupRoles);

export const groups = pgTable(
    'group',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        name: text('name').notNull(),
        ownerId: text('ownerId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (group) => ({
        uniqueName: uniqueIndex('uniqueName').on(group.name),
    }),
);

export const userGroups = pgTable(
    'userGroups',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        role: groupRoleEnum('role').notNull().default('member'),
        groupId: text('groupId')
            .notNull()
            .references(() => groups.id, { onDelete: 'cascade' }),
    },
    (userGroup) => ({
        compositePK: primaryKey({ columns: [userGroup.userId, userGroup.groupId] }),
    }),
);

export const userGroupPermissions = pgTable(
    'userGroupPermissions',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        groupId: text('groupId')
            .notNull()
            .references(() => groups.id, { onDelete: 'cascade' }),
        permission: permissionEnum('permission').notNull(),
    },
    (userGroupPermission) => ({
        compositePK: primaryKey({
            columns: [
                userGroupPermission.userId,
                userGroupPermission.groupId,
                userGroupPermission.permission,
            ],
        }),
    }),
);

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
        createdBy: text('createdBy')
            .notNull()
            .references(() => users.id),
        groupId: text('groupId').references(() => groups.id, { onDelete: 'set null' }),
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
