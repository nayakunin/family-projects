'use server';
import { ilike } from 'drizzle-orm';

import { ingredients } from '@/schema';

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
