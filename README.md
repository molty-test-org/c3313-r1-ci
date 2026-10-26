# c3313-r1-ci

Test fixture for a live test run: a tiny text-helpers library (`src/words.js`) with node:test tests (`npm test`).
Holds no real data.

## Text helpers

Import the CommonJS module with `require("./src/words")`. It exports `countWords`, `slugify`, `truncate`, `wordFrequencies`, and `estimateReadingTime`.

`wordFrequencies(text)` returns a plain object mapping lowercase words to occurrence counts. It treats punctuation as a word separator (including at word edges) and recognizes Unicode letters, numbers and combining marks. Text is normalized to Unicode NFC before counting, so `"café cafe\u0301"` (precomposed and decomposed accent) returns `{ café: 2 }`; for example, `wordFrequencies("Hello, HELLO! world.")` returns `{ hello: 2, world: 1 }`. Empty, whitespace-only, or punctuation-only text returns `{}`. This tokenizer differs from `countWords`, which retains its whitespace-separated count (so `"one,two"` counts as one word there but two frequency entries).

`estimateReadingTime(text)` returns a number of **minutes**, using `countWords(text) / 200` at a default pace of **200 whitespace-separated words per minute**. It does not round up: 200 words take 1 minute and two words take 0.01 minutes. Empty or whitespace-only text takes 0 minutes.

`slugify(text)` returns a lowercase, ASCII URL slug: runs of characters outside `a-z` and `0-9` become single hyphens, and leading or trailing hyphens are removed. Blank, whitespace-only, or punctuation-only text returns `""`. For example, `slugify("  Stable Lower CASE  title 2 ")` returns `"stable-lower-case-title-2"`.

`truncate(text, max)` limits text to `max` characters in total, counting the single `…` ellipsis character. When the text is longer than `max`, the result is the first `max - 1` characters followed by `…`, so `truncate("abcdef", 4)` returns `"abc…"`. Text whose length is at or under `max` is returned unchanged, including text of exactly `max` characters.
