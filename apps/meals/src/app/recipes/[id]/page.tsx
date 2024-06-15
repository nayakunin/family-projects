export default async function Recipe({ params }: { params: { id: string } }) {
    return <h1>Recipe {params.id}</h1>;
}
