import EventEmitter from 'events';

import { IDatabase } from './db/interface';
import { Game } from './game';
import { Hand } from './hand';
import { Player } from './player';
import { Card, ranks, stages, suits } from './types';

export class GameController {
    private db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }

    async init(): Promise<void> {
        await this.db.connect();
    }
}
