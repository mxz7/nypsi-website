const cards = [
    `<div class="card">
                    <h1>street racing 🚗</h1>

                    <ul>
                        <li>race people for money</li>
                        <li>collect cars</li>
                        <li><i>wish you were back in the 2000s</i></li>
                    </ul>

                    <img src="content/streetrace-1.png">
                </div>`,
    `<div class="card">
                    <h1>countdowns 📅</h1>

                    <ul>
                        <li>countdown to events</li>
                        <li>customisable messages</li>
                        <li><i>time machine not included</i> 😔</li>
                    </ul>

                    <img src="content/countdown-1.png">
                </div>`,
    `<div class="card">
                    <h1>minecraft ⛏</h1>

                    <ul>
                        <li>view name history for minecraft accounts</li>
                        <li>view skins for minecraft accounts</li>
                        <li><i>best game to ever be made</i> 🙏</li>
                    </ul>

                    <img src="content/minecraft-1.png">
                </div>`,
    `<div class="card">
                    <h1>chat reactions 🗣</h1>

                    <ul>
                        <li>use a custom word list</li>
                        <li>tracks statistics</li>
                        <li>can be started randomly</li>
                        <li><i>fastest typer wins</i> 😏</li>
                    </ul>

                    <img src="content/chatreaction-1.png">
                </div>`,
    `<div class="card">
                    <h1>christmas countdown 🎅</h1>

                    <ul>
                        <li>can run all year round</li>
                        <li>customisable message</li>
                        <li><i>santa exists</i> 🥺</li>
                    </ul>

                    <img src="content/christmas-1.png">
                </div>`,
    `<div class="card">
                    <h1>mention history 💬</h1>

                    <ul>
                        <li>view ghost pings</li>
                        <li>stores up to 15 mentions</li>
                        <li><i>for the famous people</i></li>
                    </ul>

                    <img src="content/mentions-1.png">
                </div>`,
    `<div class="card">
                    <h1>inventory system 🎒</h1>

                    <ul>
                        <li>collect cars for street races</li>
                        <li>use items to bully others</li>
                        <li><i>check out the handcuffs</i> 😏</li>
                    </ul>

                    <img src="content/inventory-1.png">
                </div>`,
    `<div class="card">
                    <h1>cryptocurrency 🪙</h1>

                    <ul>
                        <li>updates to real life value</li>
                        <li>virtual investments</li>
                        <li>currently uses bitcoin and ethereum</li>
                        <li><i>doge to the moon</i> 🌙</li>
                    </ul>

                    <img src="content/bitcoin-1.png">
                </div>`,
    `<div class="card">
                    <h1>prestige system 🤑</h1>

                    <ul>
                        <li>powerful rewards for prestiging</li>
                        <li>increases rewards for voting</li>
                        <li><i>seasonal economy</i> 😳</li>
                    </ul>

                    <img src="content/prestige-1.png">
                </div>`,
    `<div class="card">
                    <h1>karma system 🔮</h1>

                    <ul>
                        <li>earn karma for using nypsi</li>
                        <li>spend your karma in the karmashop</li>
                        <li><i>earn premium benefits</i> 😏</li>
                    </ul>

                    <img src="content/karma-1.png">
                </div>`,
    `<div class="card">
                    <h1>wordle 📖</h1>

                    <ul>
                        <li>play wordle on discord</li>
                        <li>i hope ur good at word games</li>
                        <li><i>im shit at them</i> 🙁</li>
                    </ul>

                    <img src="content/wordle-1.png">
                </div>`,
                `<div class="card">
                    <h1>auctions 📑</h1>

                    <ul>
                        <li>sell your items to other people at your own price</li>
                        <li>find items at cheap prices and flip them for more</li>
                        <li><i>yes there is lots of overpriced stuff too</i> 🙁</li>
                    </ul>

                    <img src="content/auction-1.png">
                </div>`
]

$(window).on("load", function () {
    $("body").removeClass("preload")

    const d = cards.length

    for (let i = 0; i < d; i++) {
        const chosen = cards[Math.floor(Math.random() * cards.length)]

        cards.splice(cards.indexOf(chosen), 1)

        $(".row").append(chosen)
    }
})