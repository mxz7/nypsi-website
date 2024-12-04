<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='self host' />

since nypsi is _almost_ entirely public, you can self host and make your own version!

_assuming you adhere to the don't be a dick license. don't claim it as your own and don't make money off of it_

<DocsHeader header='h2' text="disclaimer" />

there is no official help provided for doing this. it is not difficult to do assuming you have some
technical knowledge. you will be ignored if you ask the owner for help.

<DocsHeader header='h2' text="prerequisites" />

- a computer
- nodejs 22
- postgres
- redis
- a discord server
- git

<DocsHeader header='h2' text="get started" />

<DocsHeader header='h3' text="downloading the code" />

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
pnpm install --frozen-lockfile
```

<DocsHeader header='h3' text="setup.sh" anchor="setup-sh" />

run `setup.sh`, this will create needed folders, install a placeholder anticheat and rename
.env.example to .env

<DocsHeader header='h3' text=".env" anchor="env" />

you must fill in your .env with your values. the below keys are **NOT required** for nypsi to
function, however there will be missing functionality.

- `TOPGG_TOKEN`
- `LASTFM_TOKEN`
- `S3_*`
- `KOFI_VERIFICATION`

<DocsHeader header='h3' text="database migration" />

run `npx prisma migrate dev`. if this doesn't work there is something wrong with your database or
your dependencies.

<DocsHeader header='h3' text="compile" />

run `npx tsc` to compile nypsi's source code

<DocsHeader header='h3' text="all done!" anchor="all-done" />

you should be able to run nypsi with `node .`

<DocsHeader header='h2' text="contributing" />

to contribute to nypsi, you will need to have a github account. with this installation, you will be
able to make changes and test those changes. you will have to fork the repository, commit changes,
and then make a pull request.
