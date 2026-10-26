# c3313-r1-ci

Test fixture for a live test run: a tiny text-helpers library (`src/words.js`) with node:test tests (`npm test`).
Holds no real data.

## Text helpers

Import the CommonJS module with `require("./src/words")`. It exports `countWords`, `slugify`, `truncate`, `wordFrequencies`, and `estimateReadingTime`.

`wordFrequencies(text)` returns a plain object mapping lowercase words to occurrence counts. It treats punctuation as a word separator (including at word edges) and recognizes Unicode letters and numbers; for example, `wordFrequencies("Hello, HELLO! world.")` returns `{ hello: 2, world: 1 }`. Empty, whitespace-only, or punctuation-only text returns `{}`. This tokenizer differs from `countWords`, which retains its whitespace-separated count (so `"one,two"` counts as one word there but two frequency entries).

`estimateReadingTime(text)` returns a number of **minutes**, using `countWords(text) / 200` at a default pace of **200 whitespace-separated words per minute**. It does not round up: 200 words take 1 minute and two words take 0.01 minutes. Empty or whitespace-only text takes 0 minutes.
