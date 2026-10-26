# c3313-r1-ci

Test fixture for a live test run: a tiny text-helpers library (`src/words.js`) with node:test tests (`npm test`).
Holds no real data.

## File report CLI

Run `node bin/text-stats.js notes.txt` (or use `text-stats notes.txt` when installed as a package). The command reads exactly one explicit UTF-8 file and writes one JSON object followed by a newline to stdout. For example, a file containing:

```text
Hello, WORLD!
hello world. More
```

produces:

```json
{"wordCount":5,"wordFrequencies":{"hello":2,"world":2,"more":1},"readingTimeMinutes":0.025,"slug":"hello-world","excerpt":"Hello, WORLD!"}
```

`wordCount` is the integer count of whitespace-separated words across the **whole file**; `wordFrequencies` is an object mapping normalized words to occurrence counts across the whole file (punctuation separates words); `readingTimeMinutes` is the whole-file count divided by 200, without rounding. These totals may differ in tokenization: `"one,two"` is one whitespace word but has frequency entries for `one` and `two`. `slug` is the ASCII slug of the **first line only**, and `excerpt` is that first line truncated to at most **80 characters** including its one-character ellipsis. A blank or whitespace-only first line stays blank (empty slug and excerpt) even if later lines contain text; an empty file yields zero totals, an empty frequency object, and empty strings for slug and excerpt. LF and CRLF line endings both select the text before the first line break.

A missing argument, extra argument, or unreadable path fails with a nonzero exit, a message on stderr, and no JSON on stdout. The command never echoes file content in errors.

## Text helpers

Import the CommonJS module with `require("./src/words")`. It exports `countWords`, `slugify`, `truncate`, `wordFrequencies`, and `estimateReadingTime`.

`countWords(text)` returns the number of whitespace-separated words after trimming the text; empty or whitespace-only text returns 0. Punctuation does not split words: `countWords("one,two")` returns 1.

`wordFrequencies(text)` returns a plain object mapping lowercase words to occurrence counts. It treats punctuation as a word separator (including at word edges) and recognizes Unicode letters, numbers and combining marks. Text is normalized to Unicode NFC before counting, so `"café cafe\u0301"` (precomposed and decomposed accent) returns `{ café: 2 }`; for example, `wordFrequencies("Hello, HELLO! world.")` returns `{ hello: 2, world: 1 }`. Empty, whitespace-only, or punctuation-only text returns `{}`. This tokenizer differs from `countWords`, which retains its whitespace-separated count (so `"one,two"` counts as one word there but two frequency entries).

`estimateReadingTime(text)` returns a number of **minutes**, using `countWords(text) / 200` at a default pace of **200 whitespace-separated words per minute**. It does not round up: 200 words take 1 minute and two words take 0.01 minutes. Empty or whitespace-only text takes 0 minutes.

`slugify(text)` returns a lowercase, ASCII URL slug: runs of characters outside `a-z` and `0-9` become single hyphens, and leading or trailing hyphens are removed. Blank, whitespace-only, or punctuation-only text returns `""`. For example, `slugify("  Stable Lower CASE  title 2 ")` returns `"stable-lower-case-title-2"`.

`truncate(text, max)` limits text to `max` characters in total, counting the single `…` ellipsis character, for positive limits (`max >= 1`). When the text is longer than `max`, the result is the first `max - 1` characters followed by `…`, so `truncate("abcdef", 4)` returns `"abc…"`. Text whose length is at or under `max` is returned unchanged, including text of exactly `max` characters. For `max = 0`, empty text is returned unchanged and any other text returns a lone `…` (one character, which exceeds `max`). For negative `max`, every text, including empty text, returns a lone `…`.
