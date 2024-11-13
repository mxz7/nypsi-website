import { parse } from "$lib/functions/twemoji";

export default function parseEmoji(emoji: string) {
  if (!emoji) return "";
  let thumbnail: string;

  if (emoji.split(":")[2]) {
    const emojiID = emoji.split(":")[2].slice(0, emoji.split(":")[2].length - 1);

    thumbnail = `https://cdn.discordapp.com/emojis/${emojiID}`;

    if (emoji.split(":")[0].includes("a")) {
      thumbnail = thumbnail + ".gif";
    } else {
      thumbnail = thumbnail + ".png";
    }

    thumbnail += "?size=80";
  } else {
    try {
      thumbnail = parse(emoji, { assetType: "svg" });
    } catch (e) {
      console.error(e);
    }
  }

  return thumbnail;
}
