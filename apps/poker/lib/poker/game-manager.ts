import { BlindDurationUnit, BlindStructure } from '@/models';

import { PlayerManager } from './player-manager';
import { Action, cards, DeckItem, Round, suits } from './types';

const deck = suits.flatMap((suit) => cards.map((card) => ({ suit, card })));

type GameManagerParams = {
    players: string[];
    startingChips: number;
    blindDurationUnit: BlindDurationUnit;
    blindStructure: BlindStructure[];
    dealerIndex?: number;
};

export class GameManager {
    // Defaults
    private blindDurationUnit: BlindDurationUnit;
    private blindStructure: BlindStructure[];
    private startingChips: number;

    // Game State
    private pm: PlayerManager;
    private dealerIndex: number;
    private smallBlindIndex: number;
    private bigBlindIndex: number;
    private activePlayerIndex: number;
    private handNumber = 0;
    private deck: DeckItem[] = [];
    private communityCards: DeckItem[] = [];
    private pot = 0;
    private round: Round = 'preflop';

    // History
    private actionHistory: Action[] = [];

    constructor({
        blindDurationUnit,
        blindStructure,
        players,
        startingChips,
        dealerIndex = Math.floor(Math.random() * players.length),
    }: GameManagerParams) {
        this.blindDurationUnit = blindDurationUnit;
        this.blindStructure = blindStructure;
        this.startingChips = startingChips;
        this.activePlayerIndex = dealerIndex;
        this.dealerIndex = dealerIndex;
        this.smallBlindIndex = (dealerIndex + 1) % players.length;
        this.bigBlindIndex = (dealerIndex + 2) % players.length;

        this.pm = new PlayerManager(players, startingChips);
    }

    shuffle() {
        return deck.sort(() => Math.random() - 0.5);
    }

    startHand() {
        this.deck = this.shuffle();
        this.handNumber += 1;
        this.dealerIndex = (this.dealerIndex + 1) % this.pm.getNumberOfPlayers();
        this.smallBlindIndex = (this.dealerIndex + 1) % this.pm.getNumberOfPlayers();
        this.bigBlindIndex = (this.dealerIndex + 2) % this.pm.getNumberOfPlayers();

        const players = this.pm.getPlayers();

        players.result.forEach((playerId) => {
            players.entities.players[playerId]?.setHand([this.deck.pop()!, this.deck.pop()!]);
        });
    }

    performAction(action: Action) {
        this.actionHistory.push(action);
        const playerId = this.pm.getPlayers().result[this.activePlayerIndex];
        if (!playerId) throw new Error('Player not found');

        this.pm.performAction(playerId, action);

        switch (action.type) {
            case 'bet':
            case 'raise':
            case 'call':
                this.pot += action.amount;
                break;
        }

        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.pm.getNumberOfPlayers();

        if (this.activePlayerIndex === this.dealerIndex) {
            this.nextRound();
        }
    }

    nextRound() {
        switch (this.round) {
            case 'preflop':
                this.communityCards = [this.deck.pop()!, this.deck.pop()!, this.deck.pop()!];
                this.round = 'flop';
                break;
            case 'flop':
                this.communityCards.push(this.deck.pop()!);
                this.round = 'turn';
                break;
            case 'turn':
                this.communityCards.push(this.deck.pop()!);
                this.round = 'river';
                break;
        }
    }
}
