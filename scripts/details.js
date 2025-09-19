const youtubeURL = "https://www.youtube-nocookie.com/embed/"
const sourceURL = "https://api.themoviedb.org/3/movie"
const imgURL = "https://image.tmdb.org/t/p/w500"
const searchParam = window.location.search
const showID = searchParam.split("=")[1]
const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiKEY}`
	}
};

if (searchParam == "") {
	location.href = "/"
}

function findMovieTags(movie) {
	return movie.genres.map((elm) => { return "<p>" + elm.name + "</p>" }).join(" ")
}

function findMoviePGrating(movie) {
	let pgRating = "0"

	try {
		let rating = movie.release_dates.results.find((elm) => {
			return elm.iso_3166_1 === "US" || elm.iso_3166_1 === "GB" || elm.iso_3166_1 === "DE" || elm.iso_3166_1 === "DK"
		})

		if (!rating || rating.release_dates[0].certification == "") {
			Error("Could not find rating.")
		}

		let newRating = rating.release_dates[0].certification
		newRating = newRating.replace("+", "")
		newRating = newRating.replace("-", "")
		pgRating = newRating
	}
	catch {
		movie.release_dates.results.map((elm) => {
			if (elm.release_dates[0].certification != "" && pgRating == "0") {
				let newRating = elm.release_dates[0].certification
				newRating = newRating.replace("+", "")
				newRating = newRating.replace("-", "")
				return pgRating = newRating
			}
		}).join(" ")
	}

	return pgRating
}

function findMovieCredits(movie) {
	return movie.credits.cast.map((person) => {
		function getImage() {
			let image

			if (person.profile_path != null && person.profile_path != undefined) {
				image = `<img src="${imgURL}${person.profile_path}" alt="image of ${person.name}" title="${person.name}">`
			} else {
				image = `<img src="/icons/star.svg" alt="image of ${person.name}" title="${person.name}">`
			}

			return image
		}

		return `<li><figure>
			${getImage()}
			<figcaption>
				<p>${person.name}</p>
			</figcaption></figure></li>`
	}).join(" ")
}

function findMovieTrailer(movie) {
	let video = "<iframe src='"

	movie.videos.results.forEach((vids) => {
		if (vids.key !== "" && video === "<iframe src='") {
			if (vids.name === "Official Trailer") {
				video = `${video}${youtubeURL}${vids.key}?modestbranding=1&rel=0' width="420" height="345"
				frameborder="0" allowfullscreen></iframe>`
			}
		}
	})

	return video
}

fetch(`${sourceURL}/${showID}?append_to_response=credits,videos,release_dates`, options)
	.then((response) => response.json())
	.then(async (movie) => {
		console.log(movie)

		let element = `
			<figure><img src="${imgURL}${movie.backdrop_path}" alt="movie">
			${findMovieTrailer(movie)}
			</figure><div><h2>${movie.title}</h2>
				<p class="rating"><img loading="lazy" src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
				<div class="tags">
					${findMovieTags(movie)}
				</div><div class="info">
					<p><span>Length</span>${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min</p>
					<p><span>Language</span>${movie.spoken_languages[0].english_name}</p>
					<p><span>Rating</span>PG-${findMoviePGrating(movie)}</p>
				</div><h3>Description</h3>
				<p class="description">${movie.overview}</p><section><div id="cast-div">
				<h3>Cast</h3>
				<button id="more3">See more</button></div>
				<ol id="cast-list">
				${findMovieCredits(movie)}
				</ol></section></div>`
		document.querySelector("#content").insertAdjacentHTML("beforeend", element)
	})