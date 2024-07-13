import { eq } from 'drizzle-orm';

import { PageContainer } from '@/components/hoc/page-container';
import { PageHeader } from '@/components/hoc/page-header';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeImage, RecipeImageFallback, RecipeImagePreview } from '@/module/recipes/image';
import { Recipe, recipes } from '@/schema';
import { db } from '@/server/db';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card>
        <AspectRatio ratio={16 / 9}>
            <RecipeImage className="h-full w-full" image={recipe.heroPictureURL}>
                <RecipeImageFallback />
                <RecipeImagePreview />
            </RecipeImage>
        </AspectRatio>
        <CardHeader>
            <CardTitle>{recipe.title}</CardTitle>
        </CardHeader>
        <CardContent>{recipe.content}</CardContent>
    </Card>
);

export default async function Home() {
    const result = await db.select().from(recipes);

    return (
        <PageContainer>
            <main className="">
                <PageHeader title="Recipes" />
                <div className="grid grid-cols-3 gap-4">
                    {result.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </main>
        </PageContainer>
    );
}
