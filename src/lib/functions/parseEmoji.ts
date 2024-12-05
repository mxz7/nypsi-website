import { parse } from "@twemoji/parser";

export default function parseEmoji(emoji: string) {
  if (!emoji) return "";
  let thumbnail: string;

  if (emoji.split(":")[2]) {
    const emojiID = emoji.split(":")[2].slice(0, emoji.split(":")[2].length - 1);

    thumbnail = `https://cdn.discordapp.com/emojis/${emojiID}`;

    if (emoji.split(":")[0].includes("a")) {
      thumbnail = thumbnail + ".gif";
    } else {
      thumbnail = thumbnail + ".webp";
    }

    thumbnail += "?size=80";
  } else {
    try {
      thumbnail = parse(emoji, { assetType: "svg" })[0].url;
    } catch (e) {
      console.error(e);
    }
  }

  console.log(thumbnail);

  return thumbnail;
}
