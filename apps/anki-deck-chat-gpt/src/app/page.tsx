import { Box, Button, Grid, TextArea } from '@radix-ui/themes';

const submitHandlerAction = async (formData: FormData) => {
    'use server';

    console.log(formData);
};

export default function HomePage() {
    return (
        <main>
            <Grid columns="2" gap="2">
                <Box p="2">
                    <form action={submitHandlerAction}>
                        <TextArea name="words" placeholder="comma separated words" />
                        <Button type="submit">Generate</Button>
                    </form>
                </Box>
                <Box p="2">Column 2</Box>
            </Grid>
        </main>
    );
}
