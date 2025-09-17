let currentItemSelect = 1;

async function openAllPage(input) {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiKEY}`
		}
	};
	currentItemSelect = 1

	let parentElement
	let listElement

	if (input == "first") {
		parentElement = document.querySelector("#content section:first-of-type")
		listElement = document.querySelector("#new-list .observer")
	} else {
		parentElement = document.querySelector("#content section:last-of-type")
		listElement = document.querySelector("#popular-shows .observer")
	}

	function returnTime(id) {
		return fetch(`${sourceURL}/${id}`, options)
			.then(res => res.json())
			.then(data => {
				return `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
			})
	}

	function loadNextMovies() {
		if (parentElement.className.includes("show")) {
			currentItemSelect += 1
			let fetchURL

			if (input == "first") {
				fetchURL = showingMoviesURL
			} else {
				fetchURL = popularMoviesURL
			}

			fetch(`${fetchURL}?page=${currentItemSelect}`, options)
				.then((repsonse) => repsonse.json())
				.then(async (data) => {
					data.results.forEach((movie) => {
						let element

						if (input == "first") {
							element = `<li>
									<figure class="top-card">
										<img loading="lazy" src="${imgURL}${movie.poster_path}" alt="image of show" title="${movie.title}">
										<figcaption>
											<h4 title="${movie.title}"><span id="${movie.id}">${movie.title}</span></h4>
											<p><img loading="lazy" src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
										</figcaption>
									</figure>
								</li>`
						} else {
							let time = Promise.resolve(returnTime(movie.id))

							Promise.all([time]).then((values) => {
								element = `<li>
									<figure class="side-card">
										<img loading="lazy" src="${imgURL}${movie.poster_path}" alt="image of show ${movie.id}" title="${movie.title}">
										<figcaption>
											<h4 title="${movie.title}"><span id="${movie.id}">${movie.title}</span></h4>
											<p><img loading="lazy" src="/icons/star.svg" alt="star icon"> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
											<div class="tags">
												${movie.genre_ids.map(id => `<p>${genreList.find(genre => genre.id == id).name}</p>`).join(" ")}
											</div>
											<p>${values[0]}</p>
										</figcaption>
									</figure>
								</li>`
							})
						}

						setTimeout(() => {
							console.log(element)
							listElement.insertAdjacentHTML("beforebegin", element)
						}, 600)
					})
				})
		}
	}

	setTimeout(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				loadNextMovies()
			}
		}, {
			root: null,
			rootMargin: "0px",
			threshold: 0.5
		});

		observer.observe(listElement)
	}, 100)
}