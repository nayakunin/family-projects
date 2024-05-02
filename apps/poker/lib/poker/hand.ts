import { Card, Stage } from './types';

export class Hand {
    constructor(
        public id: string,
        public gameId: string,
        public stage: Stage,
        public communityCards: Card[] = [],
        public playerHands: { [playerId: string]: Card[] } = {},
    ) {}

    addCommunityCard(card: Card): void {
        this.communityCards.push(card);
    }

    setPlayerHand(playerId: string, cards: Card[]): void {
        this.playerHands[playerId] = cards;
    }
}
