import { eq } from 'drizzle-orm';

import { ingredients } from '@/schema';
import { db } from '@/server/db';

export default async function Home() {
    const addIngredient = async (formData: FormData) => {
        'use server';

        const label = formData.get('label') as string;

        await db.insert(ingredients).values({ label });
    };

    const removeIngredient = async (formData: FormData) => {
        'use server';

        const label = formData.get('label') as string;

        await db.delete(ingredients).where(eq(ingredients.label, label));
    };

    return (
        <form action={addIngredient}>
            <input type="text" name="label" />
            <button type="submit">Add new Ingredient</button>
        </form>
    );
}
