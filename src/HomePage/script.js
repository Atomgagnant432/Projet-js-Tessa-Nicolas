const IMG_PATH = "https://image.tmdb.org/t/p/w500";

// Récupère la clé depuis le serveur
async function init() {
    const res = await fetch('/api/config');
    const config = await res.json();
    const API_KEY = config.tmdbKey;

    const carousels = document.querySelectorAll('.carousel');

// 2. Fonction pour récupérer les données
async function getMovies(url, row, type) {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        displayMovies(data.results, row, type); 

    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        row.innerHTML = "<p>Impossible de charger les films pour le moment.</p>";
    }
}

// 3. Fonction pour afficher les films
function displayMovies(movies, row, type) {
    row.innerHTML = "";

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

        movieEl.addEventListener('click', () => {
            const type = url.includes('/tv/') ? 'tv' : 'movie';
            window.location.href = `movie.html?id=${movie.id}&type=${type}`;
        });

        const posterUrl = movie.poster_path
            ? `${IMG_PATH}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=Pas+d'image";

        movieEl.innerHTML = `
            <img src="${posterUrl}" alt="${title || 'Affiche'}">
            <div class="card-info">
              <div class="card-title">${title || "Titre indisponible"}</div>
              <div class="card-meta">${rating}</div>
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
        const type = url.includes('/tv/') ? 'tv' : 'movie';

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