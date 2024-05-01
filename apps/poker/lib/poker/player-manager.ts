import { produce } from 'immer';
import { normalize, NormalizedSchema, schema } from 'normalizr';

import { Player } from './player';
import { Action } from './types';

const player = new schema.Entity(
    'players',
    {},
    { idAttribute: (value: Player) => value.getName() },
);
const playerSchema = { players: [player] };
type NormalizedPlayers = NormalizedSchema<{ players: Record<string, Player> }, string[]>;

export class PlayerManager {
    private players: NormalizedPlayers;

    constructor(players: string[], startingChips: number) {
        this.players = normalize<
            Player,
            NormalizedPlayers['entities'],
            NormalizedPlayers['result']
        >(
            players.map((name) => new Player(name, startingChips)),
            playerSchema,
        );
    }

    getPlayers() {
        return this.players;
    }

    getNumberOfPlayers() {
        return this.players.result.length;
    }

    addPlayer(name: string, chips: number) {
        this.players = produce(this.players, (draft) => {
            const newPlayer = new Player(name, chips);
            draft.entities.players[name] = newPlayer;
            draft.result.push(name);
        });
    }

    performAction(playerName: string, action: Action) {
        this.players = produce(this.players, (draft) => {
            const player = draft.entities.players[playerName];
            if (!player) return;

            switch (action.type) {
                case 'bet':
                case 'raise':
                case 'call':
                    player.removeChips(action.amount);
                    break;
                case 'fold':
                    player.setHand([]);
                    break;
            }
        });
    }
}
