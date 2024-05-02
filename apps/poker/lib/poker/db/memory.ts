import { Game } from '../game';
import { Hand } from '../hand';
import { Player } from '../player';
import { IDatabase } from './interface';

export class InMemoryDatabase implements IDatabase {
    private players: Player[] = [];
    private games: Game[] = [];
    private hands: Hand[] = [];

    async connect(): Promise<void> {
        console.log('In-memory database initialized.');
    }

    async disconnect(): Promise<void> {
        console.log('In-memory database closed.');
    }

    async getPlayers(): Promise<Player[]> {
        return this.players;
    }

    async getGameById(gameId: string): Promise<Game> {
        const game = this.games.find((g) => g.id === gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found.`);
        }
        return game;
    }

    async getHandsByGameId(gameId: string): Promise<Hand[]> {
        return this.hands.filter((h) => h.gameId === gameId);
    }

    async saveGame(game: Game): Promise<void> {
        const existingGame = this.games.find((g) => g.id === game.id);
        if (existingGame) {
            Object.assign(existingGame, game); // Update existing game
        } else {
            this.games.push(game); // Add new game
        }
    }

    async saveHand(hand: Hand): Promise<void> {
        const existingHand = this.hands.find((h) => h.id === hand.id);
        if (existingHand) {
            Object.assign(existingHand, hand); // Update existing hand
        } else {
            this.hands.push(hand); // Add new hand
        }
    }

    async updatePlayer(player: Player): Promise<void> {
        const existingPlayer = this.players.find((p) => p.id === player.id);
        if (existingPlayer) {
            Object.assign(existingPlayer, player); // Update existing player
        } else {
            this.players.push(player); // Add new player
        }
    }
}
