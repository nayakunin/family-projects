export class Player {
    constructor(
        public id: string,
        public name: string,
        public chips: number,
        public currentBet: number = 0,
    ) {}

    placeBet(amount: number): void {
        if (amount > this.chips) {
            throw new Error('Not enough chips.');
        }
        this.chips -= amount;
        this.currentBet += amount;
    }

    resetBet(): void {
        this.currentBet = 0;
    }
}
