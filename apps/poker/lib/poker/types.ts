export const suits = ['heart', 'diamond', 'club', 'spade'] as const;
export type Suit = (typeof suits)[number];
export const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
export type Card = (typeof cards)[number];

export type DeckItem = {
    suit: Suit;
    card: Card;
};

type CheckAction = {
    type: 'check';
};

type BetAction = {
    type: 'bet';
    amount: number;
};

type FoldAction = {
    type: 'fold';
};

type RaiseAction = {
    type: 'raise';
    amount: number;
};

type CallAction = {
    type: 'call';
    amount: number;
};

export type Action = CheckAction | BetAction | FoldAction | RaiseAction | CallAction;
export type ActionHistory = Action[];

export const round = ['preflop', 'flop', 'turn', 'river'] as const;
export type Round = (typeof round)[number];
