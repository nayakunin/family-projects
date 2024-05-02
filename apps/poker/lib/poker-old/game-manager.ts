import { BlindDurationUnit, BlindStructure } from '@/models';

import { Action } from './actions';
import { PlayerManager } from './player-manager';
import { Card, ranks, Round, suits } from './types';

const deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));

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
    private deck: Card[] = [];
    private communityCards: Card[] = [];
    private pot = 0;
    private round: Round = 'preflop';
    private highestBet = 0;

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

    private shuffle() {
        return deck.sort(() => Math.random() - 0.5);
    }

    private nextRound() {
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

    private getNextPlayerIndex(index: number) {
        return (index + 1) % this.pm.getNumberOfPlayers();
    }

    playHand() {
        this.deck = this.shuffle();
        this.handNumber += 1;
        this.dealerIndex = this.getNextPlayerIndex(this.dealerIndex);
        this.smallBlindIndex = this.getNextPlayerIndex(this.dealerIndex);
        this.bigBlindIndex = this.getNextPlayerIndex(this.smallBlindIndex);
        this.activePlayerIndex = this.getNextPlayerIndex(this.bigBlindIndex);

        const players = this.pm.getPlayers();
        players.result.forEach((playerId) => {
            players.entities.players[playerId]?.setHand([this.deck.pop()!, this.deck.pop()!]);
        });
    }

    performAction(action: Action) {
        /** Save action in history */
        this.actionHistory.push(action);
        /** Get reference to a player */
        const playerId = this.pm.getPlayers().result[this.activePlayerIndex];
        if (!playerId) throw new Error('Player not found');

        /** Apply action on a player */
        this.pm.performAction(playerId, action);

        /** Update pot */
        switch (action.type) {
            case 'bet':
                this.highestBet = action.amount;
                this.pot += action.amount;
                break;
            case 'raise':
                this.highestBet = action.amount;
                this.pot += action.amount;
                break;
            case 'call':
                this.pot += action.amount;
                break;
        }

        /** Get next active player */
        let newActivePlayerIndex = this.getNextPlayerIndex(this.activePlayerIndex);
        while (!this.pm.getPlayerByIndex(newActivePlayerIndex).isPlaying()) {
            newActivePlayerIndex = this.getNextPlayerIndex(newActivePlayerIndex);
        }

        if (this.activePlayerIndex === newActivePlayerIndex) {
            this.nextRound();
        }

        if (this.activePlayerIndex === this.dealerIndex) {
            this.nextRound();
        }
    }
}
