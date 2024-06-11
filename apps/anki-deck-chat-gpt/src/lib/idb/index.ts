import { DBSchema, openDB as _openDB } from 'idb';

export type Deck = {
    name: string;
    words: string[];
    base: string;
    target: string;
    generateExamples: boolean;
    translations: Record<
        string,
        {
            base: string;
            target: string;
        }
    >;
    examples: Record<
        string,
        {
            base: string;
            target: string;
        }[]
    >;
};

export interface AnkiDB extends DBSchema {
    decks: {
        key: string;
        value: Deck;
    };
}

const dbName = 'myDatabase';
const storeName = 'decks';

export const openDB = () =>
    _openDB<AnkiDB>(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'name' });
            }
        },
    });

export const addDeck = async (deck: Omit<Deck, 'examples' | 'translations'>) => {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add({
        ...deck,
        examples: {},
        translations: {},
    });
    await tx.done;
};

export const getDeck = async (name: string) => {
    const db = await openDB();
    return db.get(storeName, name);
};

export const updateDeckWithTranslations = async (
    deckName: string,
    { examples, translations }: Pick<Deck, 'examples' | 'translations'>,
) => {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const deck = await store.get(deckName);

    if (!deck) {
        throw new Error(`Deck with name ${deckName} not found`);
    }

    deck.examples = { ...deck.examples, ...examples };
    deck.translations = { ...deck.translations, ...translations };
    deck.words = deck.words.filter((word) => !deck.translations[word]);

    await store.put(deck);
    await tx.done;
};
