import { Player } from './player';

export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
export type Rank = (typeof ranks)[number];
export const suits = ['H', 'D', 'C', 'S'] as const;
export type Suit = (typeof suits)[number];
export type Card = { rank: Rank; suit: Suit };
export const stages = ['preflop', 'flop', 'turn', 'river', 'showdown'] as const;
export type Stage = (typeof stages)[number];
export const gameStates = ['waiting', 'playing', 'completed'] as const;
export type GameState = (typeof gameStates)[number];

export type FrontendGameState = {
    players: Player[];
    communityCards: Card[];
    pot: number;
    round: Stage;
    activePlayerIndex: number;
    highestBet: number;
    gameState: GameState;
    handNumber: number;
};
