<script>
  import DocsTemplate from "$lib/components/wiki/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/wiki/DocsHeader.svelte';
</script>

<DocsTemplate title='self host' description="learn how to self host the nypsi discord bot with this step-by-step guide, including prerequisites, setup instructions, and tips for contributing your own changes." />

since nypsi is _almost_ entirely public, you can self host and make your own version!

_assuming you adhere to the don't be a dick license. don't claim it as your own and don't make money off of it_

<DocsHeader header='h2' text="disclaimer" />

there is no official help provided for doing this. it is not difficult to do assuming you have some
technical knowledge. you will be ignored if you ask the owner for help.

<DocsHeader header='h2' text="requirements" />

- nodejs LTS
- postgres
- redis

<DocsHeader header='h2' text="get started" />

<DocsHeader header='h3' text="cloning the repo" />

open terminal and get yourself in the location where you want to download nypsi and the run the
following command

```
git clone https://github.com/mxz7/nypsi
```

<DocsHeader header='h3' text="installing dependencies" />

<DocsHeader header='h4' text="package manager" />

if you don't already have pnpm installed, you can install it with the below command

```
npm i -g pnpm
```

<DocsHeader header='h4' text="nypsi dependencies" />

install nypsi dependencies with:

```
pnpm install
```

<DocsHeader header='h3' text="setup.sh" anchor="setup-sh" />

run `setup.sh`, this will create needed folders, install a placeholder anticheat and rename
.env.example to .env

<DocsHeader header='h3' text=".env" anchor="env" />

you must fill in your .env with your values. the majority of items aren't required but will probably break some functionality.

<DocsHeader header='h3' text="database migration" />

run `npx prisma migrate deploy && npx prisma generate`. if this doesn't work there is something wrong with your database or
your dependencies.

<DocsHeader header='h3' text="running" />

use `pnpm build` to buid nypsi, you can then use `node .` to run it. for development purposes you can also use `make dev`, this will continuously build the typescript files and run the bot at the same time. this makes it easier to reload commands, but if you change a non-command file, you will have to close and rerun the command.

<DocsHeader header='h2' text="contributing" />

to contribute to nypsi, you will need to have a github account. with this installation, you will be
able to make changes and test those changes. you will have to fork the repository, commit changes,
and then make a pull request.
