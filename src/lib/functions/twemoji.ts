import { parse as twemojiParse, type ParsingOptions } from "twemoji-parser";

export function parse(emoji: string, settings: ParsingOptions) {
  const out = twemojiParse(emoji, settings)[0]?.url.replace(
    "https://twemoji.maxcdn.com/v/latest/",
    "https://jdecked.github.io/twemoji/v/latest/",
  );

  return out;
}
