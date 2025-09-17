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

if (localStorage.getItem("darkMode") == "true") {
	changeDarkMode()
}

function deleteAllMovies() {
	document.querySelectorAll("#popular-shows li").forEach((elm) => { if (elm.className != "observer") { elm.remove() } })
	document.querySelectorAll("#new-list li").forEach((elm) => { if (elm.className != "observer") { elm.remove() } })
}

function changeListShowing(element, parent) {
	(element.innerHTML == "See more") ? element.innerHTML = "See less" : element.innerHTML = "See more";
	currentItemSelect = 1

	if (parent == "first") {
		document.querySelector("#content section:first-of-type").classList.toggle("show")
		document.querySelector("#content section:last-of-type").classList.toggle("hidden")

		if (!document.querySelector("#content section:first-of-type").classList.value.includes("show")) {
			deleteAllMovies()
			fetchCategory()
		}
	} else {
		document.querySelector("#content section:first-of-type").classList.toggle("hidden")
		document.querySelector("#content section:last-of-type").classList.toggle("show")

		if (!document.querySelector("#content section:last-of-type").classList.value.includes("show")) {
			deleteAllMovies()
			fetchCategory()
		}
	}
}

darkModeButton.addEventListener("change", () => {
	(darkMode == "false") ? darkMode = "true" : darkMode = "false";
	changeDarkMode()
})

document.querySelector("body").addEventListener("click", (element) => {
	let showID

	(element.target.alt) ? showID = Number(element.target.alt.split("show")[1]) : showID = Number(element.target.id) || false;

	if (showID) {
		window.location = `details.html?show=${showID}`
	}
})

if (document.querySelector("#more1")) {
	const showingMoreButton = document.querySelector("#more1")
	const popularMoreButton = document.querySelector("#more2")
	showingMoreButton.addEventListener("click", () => { changeListShowing(showingMoreButton, "first") })
	popularMoreButton.addEventListener("click", () => { changeListShowing(popularMoreButton), "second" })
}