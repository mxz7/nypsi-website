# self host

since nypsi is _almost_ entirely public, you can self host and make your own version!

## disclaimer

there is no official help provided for doing this. it is not difficult to do assuming you have some
technical knowledge. you will be ignored if you ask the owner for help.

## prerequisites

-   a computer
-   nodejs 20
-   postgres
-   redis
-   a discord server
-   git

## get started

### downloading the code

open terminal and get yourself in the location where you want to download nypsi and the run the
following command

```
git clone https://github.com/mxz7/nypsi
```

### installing dependencies

#### package manager

if you don't already have pnpm installed, you can install it with the below command

```
npm i -g pnpm
```

#### nypsi dependencies

install nypsi dependencies with:

```
pnpm install --frozen-lockfile
```

### setup.sh

run `setup.sh`, this will create needed folders, install a placeholder anticheat and rename
.env.example to .env

### .env

you must fill in your .env with your values. the below keys are **NOT required** for nypsi to
function, however there will be missing functionality.

-   `TOPGG_TOKEN`
-   `DISCORD_IMAGE_AVATAR_CHANNEL`
-   `DISCORD_IMAGE_CHANNEL`
-   `LASTFM_TOKEN`
-   `S3_*`
-   `KOFI_VERIFICATION`

### database migration

run `npx prisma migrate dev`. if this doesn't work there is something wrong with your database or
your dependencies.

### compile

run `npx tsc` to compile nypsi's source code

### all done!

you should be able to run nypsi with `node .`

## contributing

to contribute to nypsi, you will need to have a github account. with this installation, you will be
able to make changes and test those changes. you will have to fork the repository, commit changes,
and then make a pull request.
