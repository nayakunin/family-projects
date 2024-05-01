'use server';

import { redirect } from 'next/navigation';

import { CreateRoomParams, CreateRoomParamsSchema } from './models';

export async function createRoom(params: CreateRoomParams) {
    // Validate the params
    try {
        const data = CreateRoomParamsSchema.parse(params);
    } catch (error) {
        return;
    }
    // Do something with the config

    // Redirect to the room
    return redirect('/room/123');
}
