import { Action, BlindStructure, Card, PlayerState, Stage } from './types';

type UsePokerProps = {
    players: string[];
    startingChips: number;
    blindStructure: BlindStructure[];
    dealerIndex?: number;
};

type UsePokerReturn = {
    /**
     * Cards in the middle of the table
     */
    communityCards: Card[];
    /**
     * Current pot
     */
    pot: number;
    /**
     * Current hand stage
     */
    stage: Stage;
    /**
     * Index of the player who is currently active
     */
    activePlayerIndex: number;
    /**
     * Highest bet in the current round
     */
    highestBet: number;
    /**
     * Number of the current hand
     */
    handNumber: number;
    /**
     * Dealer index
     */
    dealerIndex: number;
    /**
     * Small blind index
     */
    smallBlindIndex: number;
    /**
     * Big blind index
     */
    bigBlindIndex: number;
    /**
     * Perform an action
     */
    performAction: (action: Action) => void;
    /**
     * Player state. If a player has folded, their hand will be empty
     */
    playerState: Record<string, PlayerState>;
};

export const usePoker = ({}: UsePokerProps): UsePokerReturn => {
    return {
        activePlayerIndex: 0,
        bigBlindIndex: 0,
        communityCards: [],
        dealerIndex: 0,
        handNumber: 0,
        highestBet: 0,
        performAction: () => {},
        playerState: {},
        pot: 0,
        smallBlindIndex: 0,
        stage: 'preflop',
    };
};
