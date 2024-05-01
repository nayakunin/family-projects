import { z } from 'zod';

import { BlindDurationUnitSchema, BlindStructureSchema } from '@/models';

export const BaseGameConfigSchema = z.object({
    startingChips: z.number().int().gt(0),
    blindDurationUnit: BlindDurationUnitSchema,
    blindStructure: z.array(BlindStructureSchema),
});

export const LocalGameConfigSchema = BaseGameConfigSchema.extend({
    gameType: z.literal('local'),
    players: z.array(z.string()),
});

export const OnlineGameConfigSchema = BaseGameConfigSchema.extend({
    gameType: z.literal('online'),
});

export const GameConfigSchema = z.union([LocalGameConfigSchema, OnlineGameConfigSchema]);

export const CreateRoomParamsSchema = z.object({
    config: z.discriminatedUnion('gameType', [LocalGameConfigSchema, OnlineGameConfigSchema]),
});

export type CreateRoomParams = z.infer<typeof CreateRoomParamsSchema>;
