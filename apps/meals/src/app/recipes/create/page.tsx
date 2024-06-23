'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRequest } from 'ahooks';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Autocomplete } from '@/components/hoc/autocomplete';
import { PageContainer } from '@/components/hoc/page-container';
import { PageHeader } from '@/components/hoc/page-header';
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
import { Textarea } from '@/components/ui/textarea';
import { fullnessOptions } from '@/schema';
import { getCuisines, getIngredients } from '@/server/actions';

import { createRecipe, getGroups } from './actions';

const newRecipeSchema = z.object({
    title: z.string(),
    content: z.string(),
    fullness: z.enum(fullnessOptions),
    calories: z.string(),
    ingredients: z.object({
        query: z.string(),
        open: z.boolean(),
        selected: z.array(z.number()),
    }),
    cuisines: z.object({
        query: z.string(),
        open: z.boolean(),
        selected: z.array(z.number()),
    }),
    group: z.object({
        open: z.boolean(),
        id: z.string().optional(),
    }),
});

export type FormValues = z.infer<typeof newRecipeSchema>;

export default function Create() {
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(newRecipeSchema),
        mode: 'onBlur',
        defaultValues: {
            title: '',
            calories: '0',
            fullness: 'medium',
            ingredients: {
                query: '',
                open: false,
                selected: [],
            },
            cuisines: {
                query: '',
                open: false,
                selected: [],
            },
            content: '',
            group: {
                open: false,
            },
        },
    });

    const [ingredientsQuery, cuisinesQuery] = form.watch(['ingredients.query', 'cuisines.query']);

    const { data: userGroups = [] } = useRequest(getGroups);

    const { data: ingredients = [], loading: ingredientsLoading } = useRequest(
        async () => {
            return (await getIngredients(ingredientsQuery)).map((ingredient) => ({
                label: ingredient.label,
                value: ingredient.id,
            }));
        },
        {
            refreshDeps: [ingredientsQuery],
            ready: !!ingredientsQuery,
        },
    );

    const { data: cuisines = [], loading: cuisinesLoading } = useRequest(
        async () => {
            return (await getCuisines(cuisinesQuery)).map((ingredient) => ({
                label: ingredient.label,
                value: ingredient.id,
            }));
        },
        {
            refreshDeps: [cuisinesQuery],
            ready: !!cuisinesQuery,
        },
    );

    const submitReq = useRequest((values: FormValues) => createRecipe(values), {
        manual: true,
        onSuccess: (id) => {
            if (!id) return;
            router.push('/recipes/' + id);
        },
    });

    return (
        <Form {...form}>
            <PageContainer className="flex flex-grow flex-col">
                <PageHeader
                    title={
                        <div className="flex items-baseline gap-4">
                            <span>Create a Recipe</span>
                            <FormField
                                control={form.control}
                                name="group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {!field.value.open ? (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-10"
                                                    onClick={() =>
                                                        field.onChange({
                                                            ...field.value,
                                                            open: true,
                                                        })
                                                    }
                                                >
                                                    Add to a group
                                                </Button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={field.value.id}
                                                        onValueChange={(val) =>
                                                            field.onChange({
                                                                ...field.value,
                                                                id: val,
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Group" />
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
                                                    <X
                                                        className="text-primary-500 hover:text-primary-600 h-4 w-4 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange({ open: false });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    }
                    onBack={() => router.push('/')}
                    extra={
                        <Button size="sm" form="recipe" type="submit" loading={submitReq.loading}>
                            Submit
                        </Button>
                    }
                />
                <form
                    id="recipe"
                    className="flex flex-grow gap-4"
                    onSubmit={form.handleSubmit(submitReq.runAsync)}
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
                                    <FormItem className="col-span-4">
                                        <FormLabel>Ingredients</FormLabel>
                                        <FormControl>
                                            <>
                                                <Autocomplete
                                                    placeholder="Ingredients"
                                                    value={field.value.query}
                                                    open={field.value.open}
                                                    options={ingredients}
                                                    loading={ingredientsLoading}
                                                    onChange={(query) =>
                                                        field.onChange({ ...field.value, query })
                                                    }
                                                    onOpenChange={(open) =>
                                                        field.onChange({ ...field.value, open })
                                                    }
                                                    onClick={(id) => {
                                                        field.onChange({
                                                            ...field.value,
                                                            selected: [...field.value.selected, id],
                                                        });
                                                    }}
                                                />
                                                <div>
                                                    {field.value.selected.map((id) => (
                                                        <div key={id}>{id}</div>
                                                    ))}
                                                </div>
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cuisines"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel>Cuisines</FormLabel>
                                        <FormControl>
                                            <>
                                                <Autocomplete
                                                    placeholder="Cuisines"
                                                    value={field.value.query}
                                                    open={field.value.open}
                                                    options={cuisines}
                                                    loading={cuisinesLoading}
                                                    onChange={(query) =>
                                                        field.onChange({ ...field.value, query })
                                                    }
                                                    onOpenChange={(open) =>
                                                        field.onChange({ ...field.value, open })
                                                    }
                                                    onClick={(id) => {
                                                        field.onChange({
                                                            ...field.value,
                                                            selected: [...field.value.selected, id],
                                                        });
                                                    }}
                                                />
                                                <div>
                                                    {field.value.selected.map((id) => (
                                                        <div key={id}>{id}</div>
                                                    ))}
                                                </div>
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="col-span-4 h-full">
                                    <FormLabel>Recipe</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Recipe"
                                            className="min-h-80"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </PageContainer>
        </Form>
    );
}
