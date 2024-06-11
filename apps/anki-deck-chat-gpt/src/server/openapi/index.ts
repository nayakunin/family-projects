'use server';

import OpenAI from 'openai';
import { z } from 'zod';

import { env } from '@/env';
import { TargetLanguage, targetLanguageOptions } from '@/lib/languages';

const openai = new OpenAI({
    apiKey: env.OPEN_API_KEY,
});

const baseConfig = {
    model: 'gpt-4o',
    response_format: {
        type: 'json_object',
    },
} satisfies Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming>;

type TranslateWordsParams = {
    words: string[];
    base: string;
    target: string;
};

const translateWordsResponseSchema = z.record(
    z.string(),
    z.object({
        base: z.string(),
        target: z.string(),
    }),
);

export const translateWords = async ({ base, target, words }: TranslateWordsParams) => {
    'use server';

    let additionalPrompts = '';

    if (target in targetLanguageOptions) {
        additionalPrompts = targetLanguageOptions[target as TargetLanguage]
            .map(({ prompt }) => prompt(base, target))
            .join(' ');
    }

    const response = await openai.chat.completions.create({
        ...baseConfig,
        messages: [
            {
                role: 'system',
                content: `Translate words from ${target} to ${base}. ${additionalPrompts}. Response contains a map. The key is the initial word in ${target}. You MUST preserve its initial form exactly. and value is an object with 2 keys. "base" is the translation in ${base} and "target" is the final word in ${target}. The JSON output has this shape: {"initial-word-without-changes":{"base":"translation","target":"input"}}`,
            },
            { role: 'user', content: words.join(',') },
        ],
    });

    const reply = response.choices[0]?.message.content;

    if (!reply) {
        throw new Error('No response');
    }

    const parse = await translateWordsResponseSchema.safeParseAsync(JSON.parse(reply));

    if (!parse.success) {
        throw new Error("Response doesn't match the schema:" + JSON.stringify(parse.error));
    }

    return parse.data;
};

type GenerateExamplesParams = {
    words: string[];
    base: string;
    target: string;
};

const generateExamplesResponseSchema = z.record(
    z.string(),
    z.array(
        z.object({
            base: z.string(),
            target: z.string(),
        }),
    ),
);

export const generateExamples = async ({ base, target, words }: GenerateExamplesParams) => {
    'use server';

    const response = await openai.chat.completions.create({
        ...baseConfig,
        messages: [
            {
                role: 'system',
                content: `Generate example phrases in "${target}" and their translations in "${base}". Response contains a map. Keys are the words in ${target} and the value is an array of objects. Each object has 2 keys: "base" and "target". "target" is the example phrase in ${target} and "base" is the translation in ${base}. Resulting JSON should be formatted as follows: {"word1":[{ "base": "str1", "target": "str2" },{ "base": "str3", "target": "str4" }]}`,
            },
            { role: 'user', content: words.join(',') },
        ],
    });

    const reply = response.choices[0]?.message.content;

    if (!reply) {
        throw new Error('No response');
    }

    const parse = await generateExamplesResponseSchema.safeParseAsync(JSON.parse(reply));

    if (!parse.success) {
        throw new Error("Response doesn't match the schema:" + JSON.stringify(parse.error));
    }

    return parse.data;
};
