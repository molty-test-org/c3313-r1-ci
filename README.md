# c3313-r1-ci

Test fixture for a live test run: a tiny text-helpers library (`src/words.js`) with node:test tests (`npm test`).
Holds no real data.

## Text helpers

Import the CommonJS module with `require("./src/words")`. It exports `countWords`, `slugify`, `truncate`, `wordFrequencies`, `estimateReadingTime`, `wrapText`, and `indentLines`.

`wrapText(text, width)` wraps whitespace-delimited words into lines of at most `width` characters, normalizing whitespace to single spaces within lines. Words longer than `width` stay intact on their own lines, and no line has trailing spaces. Empty or whitespace-only text returns `""`; `width` must be a positive integer. For example, `wrapText("one two six", 7)` returns `"one two\nsix"`.

`indentLines(text, n)` prefixes each line of `text` with `n` spaces and leaves empty lines empty; `n` must be a non-negative integer. For example, `indentLines("one\n\ntwo", 2)` returns `"  one\n\n  two"`.

`wordFrequencies(text)` returns a plain object mapping lowercase words to occurrence counts. It treats punctuation as a word separator (including at word edges) and recognizes Unicode letters, numbers and combining marks. Text is normalized to Unicode NFC before counting, so `"café cafe\u0301"` (precomposed and decomposed accent) returns `{ café: 2 }`; for example, `wordFrequencies("Hello, HELLO! world.")` returns `{ hello: 2, world: 1 }`. Empty, whitespace-only, or punctuation-only text returns `{}`. This tokenizer differs from `countWords`, which retains its whitespace-separated count (so `"one,two"` counts as one word there but two frequency entries).

`estimateReadingTime(text)` returns a number of **minutes**, using `countWords(text) / 200` at a default pace of **200 whitespace-separated words per minute**. It does not round up: 200 words take 1 minute and two words take 0.01 minutes. Empty or whitespace-only text takes 0 minutes.

`slugify(text)` returns a lowercase, ASCII URL slug: runs of characters outside `a-z` and `0-9` become single hyphens, and leading or trailing hyphens are removed. Blank, whitespace-only, or punctuation-only text returns `""`. For example, `slugify("  Stable Lower CASE  title 2 ")` returns `"stable-lower-case-title-2"`.

`truncate(text, max)` limits text to `max` characters in total, counting the single `…` ellipsis character, for positive limits (`max >= 1`). When the text is longer than `max`, the result is the first `max - 1` characters followed by `…`, so `truncate("abcdef", 4)` returns `"abc…"`. Text whose length is at or under `max` is returned unchanged, including text of exactly `max` characters. For `max = 0`, empty text is returned unchanged and any other text returns a lone `…` (one character, which exceeds `max`). For negative `max`, every text, including empty text, returns a lone `…`.
