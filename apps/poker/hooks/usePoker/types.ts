export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
export type Rank = (typeof ranks)[number];
export const suits = ['H', 'D', 'C', 'S'] as const;
export type Suit = (typeof suits)[number];
export type Card = { rank: Rank; suit: Suit };
export const stages = ['preflop', 'flop', 'turn', 'river', 'showdown'] as const;
export type Stage = (typeof stages)[number];
export type BlindStructure = {
    smallBlind: number;
    bigBlind: number;
    duration?: number;
};

export const actionTypes = ['fold', 'check', 'call', 'bet', 'raise'] as const;
export type ActionType = (typeof actionTypes)[number];

export type ActionTemplate<T extends ActionType> = {
    type: T;
    amount?: number;
};

export type Action =
    | ActionTemplate<'fold'>
    | ActionTemplate<'bet'>
    | ActionTemplate<'check'>
    | ActionTemplate<'call'>
    | ActionTemplate<'raise'>;
