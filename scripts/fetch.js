const popularListElement = document.querySelector("#popular-shows")
const showingListElement = document.querySelector("#new-list")
const genresURL = "https://api.themoviedb.org/3/genre/movie/list"
const sourceURL = "https://api.themoviedb.org/3/movie"
const showingMoviesURL = `${sourceURL}/now_playing`
const popularMoviesURL = `${sourceURL}/popular`
const imgURL = "https://image.tmdb.org/t/p/w185"
let genreList

async function fetchCategory() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiKEY}`
		}
	};

	await fetch(genresURL, options)
		.then((repsonse) => repsonse.json())
		.then((data) => {
			genreList = data.genres
		})

	fetch(showingMoviesURL, options)
		.then((repsonse) => repsonse.json())
		.then((data) => {
			showingListElement.insertAdjacentHTML("afterbegin", data.results.map((movie) => {
				const element = `<li>
						<figure class="top-card">
							<img loading="lazy" src="${imgURL}${movie.poster_path}" alt="image of show" title="${movie.title}">
							<figcaption>
								<h4 title="${movie.title}"><span id="${movie.id}">${movie.title}</span></h4>
								<p><img loading="lazy" src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
							</figcaption>
						</figure>
					</li>`
				return element
			}).join(" "))
		})

	fetch(popularMoviesURL, options)
		.then((repsonse) => repsonse.json())
		.then(async (data) => {
			data.results.forEach(async (movie) => {
				let time = await fetch(`${sourceURL}/${movie.id}`, options)
					.then(res => res.json())
					.then(data => {
						return `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
					})

				let element = `<li>
						<figure class="side-card">
							<img loading="lazy" src="${imgURL}${movie.poster_path}" alt="image of show ${movie.id}" title="${movie.title}">
							<figcaption>
								<h4 title="${movie.title}"><span id="${movie.id}">${movie.title}</span></h4>
								<p><img loading="lazy" src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
								<div class="tags">
									${movie.genre_ids.map(id => `<p>${genreList.find(genre => genre.id == id).name}</p>`).join(" ")}
								</div>
								<p>${time}</p>
							</figcaption>
						</figure>
					</li>`

				popularListElement.querySelector(".observer").insertAdjacentHTML("beforebegin", element)
			})
		})
}

fetchCategory()

setTimeout(() => {
	document.querySelectorAll("div").forEach((elm) => { elm.style.transition = "all 0.3s linear" })
	openAllPage("first")
	openAllPage("second")
}, 100)