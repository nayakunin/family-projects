import { z } from 'zod';

import { fullnessOptions } from '@/schema';

export const newRecipeSchema = z.object({
    title: z.string(),
    content: z.string(),
    fullness: z.enum(fullnessOptions),
    calories: z.string(),
    image: z.string().optional(),
    ingredients: z.object({
        query: z.string(),
        open: z.boolean(),
        selected: z.array(
            z.object({ id: z.number().optional(), name: z.string(), color: z.string().optional() }),
        ),
    }),
    cuisines: z.object({
        query: z.string(),
        open: z.boolean(),
        selected: z.array(z.number()),
    }),
    group: z.object({
        open: z.boolean(),
        id: z.string().optional(),
    }),
});

export type FormValues = z.infer<typeof newRecipeSchema>;
