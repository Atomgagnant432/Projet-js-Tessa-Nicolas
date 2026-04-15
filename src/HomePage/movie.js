const IMG_PATH = "https://image.tmdb.org/t/p/original";

async function init() {
  const res = await fetch('/api/config');
  const config = await res.json();
  const API_KEY = config.tmdbKey;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const detail = document.getElementById('movie-detail');

  if (!id) {
    detail.innerHTML = "<p>Film introuvable.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const movie = await response.json();

    const backdrop = movie.backdrop_path
      ? `${IMG_PATH}${movie.backdrop_path}`
      : "";

    detail.innerHTML = `
      <section class="movie-detail">
        <div class="movie-backdrop" style="background-image:url('${backdrop}')"></div>
        <div class="movie-overlay"></div>

        <div class="movie-content">
          <h1>${movie.title || "Titre indisponible"}</h1>

          <div class="movie-meta">
            <span>${movie.release_date || "Date inconnue"}</span>
            <span>${movie.runtime ? movie.runtime + " min" : "Durée inconnue"}</span>
            <span>Note : ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>

          <p class="movie-overview">
            ${movie.overview || "Aucune description disponible."}
          </p>
        </div>
      </section>
    `;
  } catch (error) {
    console.error(error);
    detail.innerHTML = "<p>Impossible de charger les données du film.</p>";
  }
}

init();