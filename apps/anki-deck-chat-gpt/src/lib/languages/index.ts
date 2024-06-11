export const targetLanguages = ['de'] as const;
export type TargetLanguage = (typeof targetLanguages)[number];

export const targetLanguageOptions = {
    de: [
        {
            key: 'plural',
            prompt: (base, target) => `Add plural form for nouns in "${target}".`,
        },
        {
            key: 'articles',
            prompt: (base, target) => `Add articles for nouns in "${target}".`,
        },
        {
            key: 'infinitive',
            prompt: (base, target) => `Use infinitive form for verbs in "${target}" and "${base}".`,
        },
        {
            key: 'capitalization',
            prompt: (base, target) => `Use correct capitalization for "${target}".`,
        },
    ],
} satisfies Record<
    TargetLanguage,
    { key: string; prompt: (base: string, target: string) => string }[]
>;

export const baseLanguages = ['en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'] as const;
