$(window).on("load", function() {
    $("body").removeClass("preload")
})

let image = "fun-1"

/**
 * 
 * @param {String} name 
 */
function changeImage(name) {
    name = name.toLowerCase()
    if (image == name) return

    console.log(name)

    console.log(image)

    document.getElementById(image).style.display = "none"

    document.getElementById(name).style.display = "inline"

    image = name
}