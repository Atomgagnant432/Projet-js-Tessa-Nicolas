import { loadFavorites, createFavButton } from "../Shared/favorites.js";

const IMG_PATH = "https://image.tmdb.org/t/p/w500";

async function init() {

  await loadFavorites();
  
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
      const row = carousel.querySelector('.movie-row');
      const url = carousel.dataset.url;
        
        getMovies(url, row, type);
    });
}

// 2. Fonction pour récupérer les données
async function getMovies(url, row, type) {
    try {
        const response = await fetch(`/api/tmdb-proxy-list/${url}`);
        const data = await response.json();
        const myCard = createCard(movieData, 'movie');
        document.querySelector('.container').appendChild(myCard);

        displayMovies(data.results, row, type); 

    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        row.innerHTML = "<p>Impossible de charger les contenus pour le moment.</p>";
    }
  }

  function displayMovies(movies, row, type) {
    row.innerHTML = "";

    movies.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie-card');

      const title = type === 'tv' ? movie.name : movie.title;
      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
      const posterUrl = movie.poster_path
        ? `${IMG_PATH}${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=Pas+d'image";

      movieEl.innerHTML = `
        <img src="${posterUrl}" alt="${title || 'Affiche'}">
        <div class="card-info">
          <div class="card-title">${title || "Titre indisponible"}</div>
          <div class="card-meta">${rating}</div>
        </div>
      `;

      movieEl.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}&type=${type}`;
      });

      row.appendChild(movieEl);
    });
  }

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

        getMovies(url, row, type);
        getMovies(url, row, type);
        });

function createCard(item, type) {
function createCard(item, type) {
  const tmdbId = item.id;
  const title = item.title || item.name;
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : "/static/no-poster.png"

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-poster-wrapper">
      <img
        src="${poster}"
        alt="${title}"
        class="card-poster"
        loading="lazy"
      />
      <div class="card-overlay">
        <p class="card-title">${title}</p>
      </div>
    </div>
  `;

  const favBtn = createFavButton(tmdbId, type);
  card.appendChild(favBtn);

  card.querySelector(".card-poster-wrapper").addEventListener("click", () => {
    window.location.href = `../DetailPage/index.html?id=${tmdbId}&type=${type}`;
    window.location.href = `../DetailPage/index.html?id=${tmdbId}&type=${type}`;
  });

  return card;
}


init();