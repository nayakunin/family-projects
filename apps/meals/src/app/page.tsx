import { eq } from 'drizzle-orm';

import { ingridients, NewIngridient } from '@/schema';
import { db } from '@/server/db';

export default async function Home() {
    const addIngridient = async (formData: FormData) => {
        'use server';

        const data = Object.fromEntries(formData.entries()) as NewIngridient;

        await db.insert(ingridients).values(data);
    };

    const removeIngridient = async (formData: FormData) => {
        'use server';

        const label = formData.get('label') as string;

        await db.delete(ingridients).where(eq(ingridients.label, label));
    };

    return (
        <form action={removeIngridient}>
            <input type="text" name="label" />
            <button type="submit">Add new Ingridient</button>
        </form>
    );
}
