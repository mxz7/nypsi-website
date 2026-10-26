---
name: wiki-commands
description: Verify bot command syntax when updating nypsi wiki content, especially after commands are grouped or slash options change. Use for command examples in src/routes/wiki, not general component styling.
---

# Wiki command examples

Use the bot repository, `mxz7/nypsi`, as the source of truth for command names and options.
Check recent relevant PRs and inspect `src/commands/<name>.ts` at the resulting revision.
`slashEnabled` and `slashData` determine slash availability; prefix aliases and `setShorthands`
do not register separate slash commands. Preserve supported prefix examples when documenting changes.

Current grouped commands introduced by PR #2685:

- `bank`: `deposit`, `withdraw`, `rob`. `$deposit`, `$withdraw`, and `$bankrob` remain shortcuts.
- `karma`: `balance`, `shop`, `buy`, `help`. Buying uses the `item-karmashop` option.
  `$karma`, `$karmashop`, and `$karmahelp` remain supported.
- `user`: `info`, `avatar`, `banner`, `avatar-history`, `username-history`, `join`.
- `rate`: the former standalone rating names, such as `pp`, `iq`, and `height`.

PR #2690 gives `/use` separate `item`, optional `amount`, and optional `member` options.
Autocomplete suggests usable owned items with counts. Amount defaults to one and supports `all`
only for items whose definitions accept quantities. Check `src/models/ItemUse.ts`,
`src/utils/functions/economy/item-use.ts`, and the individual item handler before describing
quantity or target behavior. Verify example item IDs against `data/items.json`.

Last.fm music commands remain prefix-only; configuring the account still uses `/settings me lastfm`.
Do not infer slash support from a command handler accepting interaction types.

Wiki pages are mdsvex `+page.md` files. Search all of `src/routes/wiki` for affected command
references, including setup, FAQ, premium, progression, and item guides. Keep the existing
lowercase voice and shared docs components. Run `pnpm checks` after editing; compile changed
Markdown through mdsvex when checking rendered syntax, since svelte-check does not check the
Markdown pages directly.
