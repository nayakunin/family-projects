`base language` - the one you know
`target language` - the one you learn

1. Select base language, chose if you want TTS, chose if you want examples
2. Upload words as a file or with an input
3. Parse words into an array
4. In parrallel for each word do the following
    - Translate to target language. Use several most common translations
    - Add TTS for the initial word
    - Generate a few examples with the word in the target language
    - Add TTS to examples in the target language
    - Translate examples to base language
5. After a word is completed, save it the browser into a table
6. Upon completion download a file. It should be compiled into Anki Deck file format.
