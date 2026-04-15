const IMG_PATH = "https://image.tmdb.org/t/p/w500";

// Récupère la clé depuis le serveur
async function init() {
    const res = await fetch('/api/config');
    const config = await res.json();
    const API_KEY = config.tmdbKey;

    const carousels = document.querySelectorAll('.carousel');

// 2. Fonction pour récupérer les données
async function getMovies(url, row) {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        displayMovies(data.results, row); 

    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        row.innerHTML = "<p>Impossible de charger les films pour le moment.</p>";
    }
}

// 3. Fonction pour afficher les films
function displayMovies(movies, row) {
    row.innerHTML = "";

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

            movieEl.addEventListener('click', () => {
// redirection vers une page détail avec l'id du film
            window.location.href = `movie.html?id=${movie.id}`;
            });

        const posterUrl = movie.poster_path
            ? `${IMG_PATH}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=Pas+d'image";

        movieEl.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <div class="card-info">
              <div class="card-title">${movie.title}</div>
              <div class="card-meta">${movie.vote_average.toFixed(1)}</div>
            </div>`;
        row.appendChild(movieEl);
    });
}
// 4. Evenement de Rotation des boutons
carousels.forEach(carousel => {
        const row = carousel.querySelector('.movie-row');
        const leftBtn = carousel.querySelector('.left');
        const rightBtn = carousel.querySelector('.right');

        const url = carousel.dataset.url;

        leftBtn.addEventListener('click', () => {
            row.scrollLeft -= 300;
        });

        rightBtn.addEventListener('click', () => {  
            row.scrollLeft += 300;
        });

        getMovies(url, row);
        });
    }
init();