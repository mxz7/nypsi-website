<script>
  import DocsTemplate from "$lib/components/docs/DocsTemplate.svelte"
  import DocsHeader from '$lib/components/docs/DocsHeader.svelte';
</script>

<DocsTemplate title='last.fm integration' description="connect nypsi to your last.fm account to show now playing, top tracks, artists, and recent songs. easy spotify integration and setup instructions." />

<DocsHeader header='h2' text="getting started" />

first, you must create a [last.fm](https://last.fm) account. you can then follow [this](https://community.spotify.com/t5/FAQs/How-can-I-connect-Spotify-to-Last-fm/ta-p/4795301) guide to connect your spotify to last.fm

you then need to link your last.fm username to nypsi. to do this, run `/settings me lastfm`

<DocsHeader header='h2' text="tracking music" />

nypsi doesn't track your music, last.fm does. if you are having trouble with this, check out [this](https://support.last.fm/t/spotify-has-stopped-scrobbling-what-can-i-do/3184) guide

<DocsHeader header='h2' text="now playing" />

you can view your currently playing song by using `/nowplaying`

<DocsHeader header='h2' text="top tracks / artists" anchor="top-tracks-artists" />

you can view your top tracks / artists by using the respective commands (`/toptracks` / `/topartists`)

by default, nypsi will show the last week of data. you can change this to view all-time, last year or month. an example of this can be seen below

`/toptracks length:year`

<DocsHeader header='h2' text="recnt songs" />

to view your recently played songs, use `$recentsongs`
