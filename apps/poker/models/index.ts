import { z } from 'zod';

export const BlindDurationUnitSchema = z.union([z.literal('minutes'), z.literal('hands')]);
export type BlindDurationUnit = z.infer<typeof BlindDurationUnitSchema>;

export const BlindStructureSchema = z.object({
    smallBlind: z.number().int().gt(0),
    bigBlind: z.number().int().gt(0),
    duration: z.number().int().gt(0).optional(),
});
export type BlindStructure = z.infer<typeof BlindStructureSchema>;

export const GameTypeSchema = z.union([z.literal('online'), z.literal('local')]);
export type GameType = z.infer<typeof GameTypeSchema>;
