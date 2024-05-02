export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
export type Rank = (typeof ranks)[number];
export const suits = ['H', 'D', 'C', 'S'] as const;
export type Suit = (typeof suits)[number];
export type Card = { rank: Rank; suit: Suit };
export type Round = 'preflop' | 'flop' | 'turn' | 'river';
