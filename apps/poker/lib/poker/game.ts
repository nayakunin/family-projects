import { Hand } from './hand';
import { GameState } from './types';

export class Game {
    constructor(
        public id: string,
        public state: GameState,
        public pot: number = 0,
        public dealerId: string,
        public hands: Hand[] = [],
    ) {}

    addToPot(amount: number): void {
        this.pot += amount;
    }
}
