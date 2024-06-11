'use client';

import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    Select,
    Text,
    TextArea,
    TextField,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';

import { processWordsInBatches } from '@/client/batch';
import { addDeck, getDeck } from '@/lib/idb';
import { baseLanguages, targetLanguages } from '@/lib/languages';

type FormValues = {
    name: string;
    words: string;
    base: string;
    target: string;
    generateExamples: boolean;
};

export default function HomePage() {
    const { data, mutateAsync } = useMutation({
        mutationKey: ['submit-words'],
        mutationFn: async ({ words, ...rest }: FormValues) => {
            const splitWords = words.split(',').map((word) => word.trim());

            await addDeck({
                ...rest,
                words: splitWords,
            });

            return {
                words: splitWords,
                ...rest,
            };
        },
    });

    const { mutate: translateWords } = useMutation({
        mutationKey: ['translate-words'],
        mutationFn: async () => {
            if (!data) return;

            await processWordsInBatches(data);

            console.log(await getDeck(data.name));
        },
    });

    return (
        <main>
            <Grid columns="2" gap="2">
                <Box p="2">
                    <Formik<FormValues>
                        initialValues={{
                            name: '',
                            words: '',
                            base: 'en',
                            target: 'de',
                            generateExamples: true,
                        }}
                        onSubmit={async (values) => await mutateAsync(values)}
                    >
                        {(props) => (
                            <form onSubmit={props.handleSubmit}>
                                <TextField.Root
                                    name="name"
                                    placeholder="Deck Name"
                                    value={props.values.name}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                                <TextArea
                                    name="words"
                                    placeholder="comma separated words"
                                    value={props.values.words}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                                <Select.Root
                                    name="base"
                                    value={props.values.base}
                                    onValueChange={(value) => props.setFieldValue('base', value)}
                                >
                                    <Select.Trigger placeholder="Base language" />
                                    <Select.Content>
                                        {baseLanguages.map((lang) => (
                                            <Select.Item key={lang} value={lang}>
                                                {lang}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                                <Select.Root
                                    name="target"
                                    value={props.values.target}
                                    onValueChange={(value) => props.setFieldValue('target', value)}
                                >
                                    <Select.Trigger placeholder="Target language" />
                                    <Select.Content>
                                        {targetLanguages.map((lang) => (
                                            <Select.Item key={lang} value={lang}>
                                                {lang}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                                <Text as="label" size="2">
                                    <Flex gap="2">
                                        <Checkbox
                                            defaultChecked
                                            checked={props.values.generateExamples}
                                            onCheckedChange={(value) =>
                                                props.setFieldValue('generateExamples', value)
                                            }
                                        />
                                        Generate examples
                                    </Flex>
                                </Text>
                                <Button type="submit">Submit</Button>
                            </form>
                        )}
                    </Formik>
                </Box>
                <Box p="2">
                    <Button onClick={() => translateWords()}>Generate</Button>
                </Box>
            </Grid>
        </main>
    );
}
