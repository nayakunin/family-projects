import { describe, it } from 'vitest';

import { GameManager } from './game-manager';

describe('GameManager', () => {
    it('should create a new game manager', () => {
        const gm = new GameManager({
            blindDurationUnit: 'hands',
            blindStructure: [
                {
                    bigBlind: 10,
                    smallBlind: 5,
                },
            ],
            players: ['Alice', 'Bob'],
            startingChips: 1000,
            dealerIndex: 0,
        });
    });
});
