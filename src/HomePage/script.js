const IMG_PATH = "https://image.tmdb.org/t/p/w500";

async function init() {
  const res = await fetch('/api/config');
  const config = await res.json();
  const API_KEY = config.tmdbKey;

  const carousels = document.querySelectorAll('.carousel');

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
  });
}

init();