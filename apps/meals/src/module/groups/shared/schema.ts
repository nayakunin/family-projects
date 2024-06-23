import { z } from 'zod';

import { groupRoles, permissions } from '@/schema';

export const formValuesSchema = z.object({
    name: z.string().min(5).max(255),
    users: z.object({
        query: z.string(),
        selected: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                role: z.enum(groupRoles),
                permissions: z.enum(permissions).array(),
                image: z.string().nullable(),
                email: z.string(),
            }),
        ),
    }),
});

export type FormValues = z.infer<typeof formValuesSchema>;
