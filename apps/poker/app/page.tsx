'use client';

import { Button } from '@/components/ui/button';
import { createRoom } from '@/server/actions';

export default function Page() {
    return (
        <>
            <h1 className="text-3xl font-bold underline">Page</h1>
            <Button
                onClick={async () => {
                    await createRoom({
                        config: {
                            gameType: 'online',
                            startingChips: 1000,
                            blindDurationUnit: 'hands',
                            blindStructure: [
                                {
                                    bigBlind: 10,
                                    smallBlind: 5,
                                },
                            ],
                        },
                    });
                }}
            >
                Click me
            </Button>
        </>
    );
}
