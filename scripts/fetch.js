const popularListElement = document.querySelector("#popular-shows")
const showingListElement = document.querySelector("#new-list")
const genresURL = "https://api.themoviedb.org/3/genre/movie/list"
const sourceURL = "https://api.themoviedb.org/3/movie"
const showingMoviesURL = `${sourceURL}/now_playing`
const popularMoviesURL = `${sourceURL}/popular`
const imgURL = "https://image.tmdb.org/t/p/w185"
let genreList
let text
let datas

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
			showingListElement.innerHTML = data.results.map((movie) => {
				const element = `<li>
						<figure class="top-card">
							<img src="${imgURL}${movie.poster_path}" alt="image of the show">
							<figcaption>
								<h4>${movie.title}</h4>
								<p><img src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
							</figcaption>
						</figure>
					</li>`
				return element
			}).join(" ")
		})

	fetch(popularMoviesURL, options)
		.then((repsonse) => repsonse.json())
		.then(async (data) => {
			datas = data

			data.results.forEach(async (movie) => {
				let time = await fetch(`${sourceURL}/${movie.id}`, options)
					.then(res => res.json())
					.then(data => {
						return `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
					})

				let element = `<li>
						<figure class="side-card">
							<img src="${imgURL}${movie.poster_path}" alt="image of the show">
							<figcaption>
								<h4>${movie.title}</h4>
								<p><img src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
								<div class="tags">
									${movie.genre_ids.map(id => `<p>${genreList.find(genre => genre.id == id).name}</p>`).join(" ")}
								</div>
								<p>${time}</p>
							</figcaption>
						</figure>
					</li>`

				popularListElement.insertAdjacentHTML("beforeend", element)
			})
		})
}

fetchCategory()