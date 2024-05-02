import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { GameController } from './controller';
import { InMemoryDatabase } from './db/memory';
import { Game } from './game';
import { Player } from './player';
import { stages } from './types';

describe('Poker Game Unit Test', () => {
    let db: InMemoryDatabase;
    let controller: GameController;
    let players: Player[];

    beforeEach(async () => {
        // Setup players
        players = [
            new Player('1', 'Alice', 1000),
            new Player('2', 'Bob', 1000),
            new Player('3', 'Charlie', 1000),
        ];

        db = new InMemoryDatabase();
        await db.connect();

        // Populate the database with initial data
        for (const player of players) {
            await db.updatePlayer(player);
        }

        controller = new GameController(db);
        await controller.init();
    });

    afterEach(async () => {
        await db.disconnect();
    });

    it('plays several hands, progressing through each stage', async () => {
        // Start a new game
        const gameId = 'game-1';
        const dealerId = players[0].id; // Set a starting dealer
        const game = new Game(gameId, 'waiting', 0, dealerId);
        await db.saveGame(game);

        await controller.startGame(gameId); // Start the game flow

        // Function to evaluate a game state and transition checks
        const evaluateGameState = async () => {
            const hands = await db.getHandsByGameId(gameId);

            expect(hands.length).toBeGreaterThan(0); // Ensure at least one hand has been played

            const lastHand = hands[hands.length - 1];
            expect(stages).toContain(lastHand.stage);

            if (lastHand.stage === 'showdown') {
                console.log('Game reached a showdown.');
            }
        };

        // Play a few hands by simulating transitions
        for (let i = 0; i < 3; i++) {
            await evaluateGameState();

            // Advance game to next hand
            const currentGame = await db.getGameById(gameId);
            const newDealerIndex =
                (players.findIndex((p) => p.id === currentGame.dealerId) + 1) % players.length;
            currentGame.dealerId = players[newDealerIndex].id;
            await db.saveGame(currentGame);
            await controller.startGame(gameId); // Restart with the new dealer
        }
    });
});
