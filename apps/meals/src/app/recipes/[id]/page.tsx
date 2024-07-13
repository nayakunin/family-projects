import { PageContainer } from '@/components/hoc/page-container';
import { RecipeImage } from '@/module/recipes/image';

import { parseMarkdown } from '../create/actions';
import { getRecipe } from './actions';
import { Options } from './options';

export default async function Recipe({ params }: { params: { id: string } }) {
    const recipe = await getRecipe(params.id);
    const markdown = await parseMarkdown(recipe.content);

    return (
        <PageContainer>
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <RecipeImage image={recipe.heroPictureUrl} />
                    <div className="flex flex-col justify-end gap-2">
                        <h1 className="text-lg">{recipe.title}</h1>
                        <ul>
                            <li>Calories: {recipe.calories} cal</li>
                            <li>Created At: {recipe.createdAt.toLocaleDateString()}</li>
                            <li>Group: {recipe.groupName}</li>
                        </ul>
                    </div>
                </div>
                <Options />
            </div>
            <div className="markdown-body mt-4" dangerouslySetInnerHTML={{ __html: markdown }} />
        </PageContainer>
    );
}
