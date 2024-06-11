import { Deck, updateDeckWithTranslations } from '@/lib/idb';
import { generateExamples, translateWords } from '@/server/openapi';

export const processWordsInBatches = async (
    deck: Pick<Deck, 'words' | 'base' | 'name' | 'target' | 'generateExamples'>,
    batchSize = 10,
) => {
    const { words, base, target } = deck;
    for (let i = 0; i < words.length; i += batchSize) {
        const batch = words.slice(i, i + batchSize);
        const [translatesReq, examplesReq] = await Promise.allSettled([
            translateWords({ base, target, words: batch }),
            deck.generateExamples
                ? generateExamples({ base, target, words: batch })
                : Promise.resolve({}),
        ]);

        let t: Deck['translations'] = {};
        let e: Deck['examples'] = {};

        if (translatesReq.status === 'fulfilled') {
            t = translatesReq.value;
        }

        if (examplesReq.status === 'fulfilled') {
            e = examplesReq.value;
        }

        await updateDeckWithTranslations(deck.name, {
            translations: t,
            examples: e,
        });
    }
};
