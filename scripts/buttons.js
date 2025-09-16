const showingMoreButton = document.querySelector("#more1")
const popularMoreButton = document.querySelector("#more2")
const darkModeButton = document.querySelector("#mode")
let darkMode = localStorage.getItem("darkMode") || false

function changeDarkMode() {
	document.querySelector("body").classList.toggle("dark")
	document.querySelector("body").classList.toggle("light")
	document.querySelectorAll(".icon").forEach((elm) => {
		let source = elm.src.split(".svg")[0];
		(source.includes("_white")) ? elm.src = source.split("_")[0] + ".svg" : elm.src = source + "_white.svg";
	})

	localStorage.setItem("darkMode", darkMode)
}

darkModeButton.addEventListener("change", () => {
	(darkMode == "false") ? darkMode = "true" : darkMode = "false";
	changeDarkMode()
})