'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Autocomplete } from '@/components/hoc/autocomplete';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { fullnessOptions, insertRecipeSchema } from '@/schema';
import { getCuisines, getIngredients } from '@/server/actions';

const newRecipeSchema = insertRecipeSchema.extend({
    ingredients: z.array(z.object({ label: z.string(), value: z.number() })),
    cuisines: z.array(z.object({ label: z.string(), value: z.number() })),
});

type NewRecipe = z.infer<typeof newRecipeSchema>;

export default function Create() {
    const form = useForm<NewRecipe>({
        resolver: zodResolver(newRecipeSchema),
        defaultValues: {
            title: '',
            calories: 0,
            fullness: 'medium',
            ingredients: [],
            cuisines: [],
        },
    });

    const ingredientQueryFn = async (query: string) => {
        return (await getIngredients(query)).map((ingredient) => ({
            label: ingredient.label,
            value: ingredient.id,
        }));
    };

    const cuisineQueryFn = async (query: string) => {
        return (await getCuisines(query)).map((cuisine) => ({
            label: cuisine.label,
            value: cuisine.id,
        }));
    };

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Title" {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Calories" {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fullness"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Select {...field}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Fullness" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fullnessOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ingredients</FormLabel>
                        <FormControl>
                            <Autocomplete {...field} queryFn={ingredientQueryFn} throttle={500} />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="cuisines"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cuisines</FormLabel>
                        <FormControl>
                            <Autocomplete {...field} queryFn={cuisineQueryFn} throttle={500} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </Form>
    );
}
