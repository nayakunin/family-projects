'use server';

import { redirect } from 'next/navigation';

export type JoinRoomError = 'room-not-found' | 'room-full';

export type JoinRoomReturn = {
    error?: {
        code: string;
        message: string;
    };
};

export async function joinRoom(roomId: string): Promise<JoinRoomReturn> {
    if (Math.random() < 0.5) {
        redirect(`/room/${roomId}`);
    }

    return {
        error: {
            code: 'room-not-found',
            message: 'Room not found',
        },
    };
}
