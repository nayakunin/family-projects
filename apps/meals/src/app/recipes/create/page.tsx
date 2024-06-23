'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Autocomplete } from '@/components/hoc/autocomplete';
import { PageContainer } from '@/components/hoc/page-container';
import { PageHeader } from '@/components/hoc/page-header';
import { ThemedEditor } from '@/components/hoc/themed-editor';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { fullnessOptions, insertRecipeSchema } from '@/schema';
import { createRecipe, getCuisines, getIngredients } from '@/server/actions';

import { getGroups } from './actions';

const newRecipeSchema = insertRecipeSchema.extend({
    calories: z.string(),
    ingredients: z.array(z.object({ label: z.string(), value: z.number() })),
    cuisines: z.array(z.object({ label: z.string(), value: z.number() })),
    groupId: z.string().optional(),
});

export type NewRecipe = z.infer<typeof newRecipeSchema>;

export default function Create() {
    const router = useRouter();
    const editorFormItemRef = useRef<ElementRef<'div'>>(null);
    const editorContainerRef = useRef<ElementRef<'div'>>(null);
    const [editorHeight, setEditorHeight] = useState(450);

    const form = useForm<NewRecipe>({
        resolver: zodResolver(newRecipeSchema),
        defaultValues: {
            title: '',
            calories: '0',
            fullness: 'medium',
            ingredients: [],
            cuisines: [],
            content: '',
            groupId: undefined,
        },
    });

    const { data: userGroups } = useRequest(getGroups);

    const submitReq = useRequest(createRecipe, {
        manual: true,
        onSuccess: (id) => {
            if (!id) return;
            router.push('/recipes/' + id);
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

    const handleSubmit = ({ cuisines, ingredients, calories, ...rest }: NewRecipe) => {
        submitReq.run({
            recipe: {
                ...rest,
                calories: Number(calories),
            },
            cuisines: cuisines.map((cuisine) => cuisine.value),
            ingredients: ingredients.map((ingredient) => ingredient.value),
        });
    };

    useEffect(() => {
        if (editorFormItemRef.current && editorContainerRef.current) {
            setEditorHeight(
                editorFormItemRef.current.clientHeight -
                    (editorContainerRef.current.offsetTop - editorFormItemRef.current.offsetTop),
            );
        }
    }, []);

    return (
        <PageContainer className="flex flex-grow flex-col">
            <PageHeader
                title="Create a Recipe"
                onBack={() => router.push('/')}
                extra={
                    <Button size="sm" form="recipe" type="submit" loading={submitReq.loading}>
                        Submit
                    </Button>
                }
            />
            <Form {...form}>
                <form
                    id="recipe"
                    className="flex flex-grow gap-4"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <div>
                        <div className="grid grid-cols-4 gap-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="calories"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Calories</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Calories"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fullness"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Fullness</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ingredients"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Ingredients</FormLabel>
                                        <FormControl>
                                            <Autocomplete
                                                {...field}
                                                queryFn={ingredientQueryFn}
                                                throttle={500}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cuisines"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Cuisines</FormLabel>
                                        <FormControl>
                                            <Autocomplete
                                                {...field}
                                                queryFn={cuisineQueryFn}
                                                throttle={500}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {userGroups && !!userGroups.length && (
                                <FormField
                                    control={form.control}
                                    name="groupId"
                                    render={({ field }) => (
                                        <FormItem className="col-span-4 -mt-2">
                                            <FormLabel>Group</FormLabel>
                                            <FormControl>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder="Group"
                                                            {...field}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {userGroups.map((group) => (
                                                            <SelectItem
                                                                key={group.id}
                                                                value={group.id}
                                                            >
                                                                {group.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="col-span-4 h-full" ref={editorFormItemRef}>
                                    <FormLabel>Recipe</FormLabel>
                                    <FormControl>
                                        <div ref={editorContainerRef}>
                                            <ThemedEditor
                                                className="border-input ring-offset-background rounded-md border py-4 pr-4"
                                                height={`${editorHeight}px`}
                                                language="markdown"
                                                options={{
                                                    minimap: { enabled: false },
                                                    wordWrap: 'on',
                                                    automaticLayout: true,
                                                }}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </PageContainer>
    );
}
