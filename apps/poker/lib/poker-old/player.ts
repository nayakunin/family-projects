import { Card } from './types';

export class Player {
    private name: string;
    private chips: number;
    private hand?: Card[];

    constructor(name: string, chips: number) {
        this.name = name;
        this.chips = chips;
    }

    getName() {
        return this.name;
    }

    getChips() {
        return this.chips;
    }

    addChips(amount: number) {
        this.chips += amount;
    }

    removeChips(amount: number) {
        this.chips -= amount;
    }

    getHand() {
        return this.hand;
    }

    setHand(hand?: Card[]) {
        this.hand = hand;
    }

    isPlaying() {
        return this.hand !== undefined;
    }
}
