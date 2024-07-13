'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { PageContainer } from '@/components/hoc/page-container';
import { PageHeader } from '@/components/hoc/page-header';
import { Form } from '@/components/ui/form';

import { CaloriesField } from './_components/calories';
import { ContentField } from './_components/content';
import { CuisineField } from './_components/cuisine';
import { FullnessField } from './_components/fullness';
import { GroupPicker } from './_components/groups-picker';
import { IngredientsField } from './_components/ingredients';
import { RecipeImageField } from './_components/recipe-image';
import { SubmitButton } from './_components/submit-button';
import { TitleField } from './_components/title';
import { createRecipe } from './actions';
import { FormValues, newRecipeSchema } from './schema';

const defaultValues: FormValues = {
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
};

export default function Create() {
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(newRecipeSchema),
        mode: 'onBlur',
        defaultValues,
    });

    const submitReq = useRequest((values: FormValues) => createRecipe(values), {
        manual: true,
        onSuccess: (id) => {
            if (!id) return;
            router.push('/recipes/' + id);
        },
    });

    return (
        <>
            <Form {...form}>
                <PageContainer className="flex flex-grow flex-col">
                    <PageHeader
                        title={
                            <div className="flex items-baseline gap-4">
                                <span>Create a Recipe</span>
                                <GroupPicker />
                            </div>
                        }
                        onBack={() => router.push('/')}
                        extra={<SubmitButton loading={submitReq.loading} />}
                    />
                    <form
                        id="recipe"
                        className="flex flex-col gap-4"
                        onSubmit={form.handleSubmit(submitReq.runAsync)}
                    >
                        <div className="flex items-start gap-4">
                            <RecipeImageField />
                            <div className="grid w-full max-w-[600px] grid-cols-4 gap-2">
                                <TitleField />
                                <CaloriesField />
                                <FullnessField />
                                <IngredientsField />
                                <CuisineField />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <ContentField />
                        </div>
                    </form>
                </PageContainer>
            </Form>
        </>
    );
}
