// 1. Configuration de l'API
const API_URL = "https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const row = document.getElementById('movie-row');
const leftBtn = document.querySelector('.carousel-btn.left');
const rightBtn = document.querySelector('.carousel-btn.right');


// Récupère la clé depuis le serveur
async function init() {
    const res = await fetch('/api/config');
    const config = await res.json();
    const API_KEY = config.tmdbKey;

// 2. Fonction pour récupérer les données
async function getMovies() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const data = await response.json();
        displayMovies(data.results); 

    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        row.innerHTML = "<p>Impossible de charger les films pour le moment.</p>";
    }
}

// 3. Fonction pour afficher les films
function displayMovies(movies) {
    console.log("Films reçus :", movies);
    row.innerHTML = "";

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

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
leftBtn.addEventListener('click', () => {
  row.scrollLeft -= 300;
});

rightBtn.addEventListener('click', () => {
  row.scrollLeft += 300;
});
getMovies();
}
init();