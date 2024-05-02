import { Game } from '../game';
import { Hand } from '../hand';
import { Player } from '../player';

export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getPlayers(): Promise<Player[]>;
    getGameById(gameId: string): Promise<Game>;
    getHandsByGameId(gameId: string): Promise<Hand[]>;
    saveGame(game: Game): Promise<void>;
    saveHand(hand: Hand): Promise<void>;
    updatePlayer(player: Player): Promise<void>;
}
