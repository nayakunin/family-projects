type CheckAction = {
    type: 'check';
};

type BetAction = {
    type: 'bet';
    amount: number;
};

type FoldAction = {
    type: 'fold';
};

type RaiseAction = {
    type: 'raise';
    amount: number;
};

type CallAction = {
    type: 'call';
    amount: number;
};

export type Action = CheckAction | BetAction | FoldAction | RaiseAction | CallAction;
export type ActionHistory = Action[];
