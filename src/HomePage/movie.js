const IMG_PATH = "https://image.tmdb.org/t/p/original";

async function init() {
    const res = await fetch('/api/config');
    const config = await res.json();
    const API_KEY = config.tmdbKey;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type') || 'movie';

    const detail = document.getElementById('movie-detail');

  if (!id) {
    detail.innerHTML = "<p>Film introuvable.</p>";
    return;
  }

  try {
    const endpoint = type === 'tv'
      ? `https://api.themoviedb.org/3/tv/${id}?language=fr-FR`
      : `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`;

      const creditsEndpoint = type === 'tv'
      ? `https://api.themoviedb.org/3/tv/${id}/credits?language=fr-FR`
      : `https://api.themoviedb.org/3/movie/${id}/credits?language=fr-FR`;

    const [response, creditsRes] = await Promise.all([
      fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }),
      fetch(creditsEndpoint, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      })
    ]);
    const data = await response.json();
    const credits = await creditsRes.json();
    const cast = (credits.cast || []).slice(0, 8);

    const title = type === 'tv' ? data.name : data.title;
    const date = type === 'tv' ? data.first_air_date : data.release_date;
    const duration = type === 'tv'
      ? `${data.number_of_seasons || 0} saisons / ${data.number_of_episodes || 0} épisodes`
      : `${data.runtime || "?"} min`;

    const genres = data.genres?.map(g => g.name).join(", ") || "Genres inconnus";
    const backdrop = data.backdrop_path ? `${IMG_PATH}${data.backdrop_path}` : "";
    const poster = data.poster_path ? `${IMG_PATH}${data.poster_path}` : "";

    const castHTML = cast.map(actor => `
      <div class="actor-card">
        <img src="${
          actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : 'https://via.placeholder.com/185x278?text=Acteur'
        }" alt="${actor.name}">
        <div class="actor-info">
          <div class="actor-name">${actor.name}</div>
          <div class="actor-role">${actor.character || "Rôle inconnu"}</div>
        </div>
      </div>
    `).join("");

    detail.innerHTML = `
      <section class="movie-detail">
        <div class="movie-backdrop" style="background-image:url('${backdrop}')"></div>
        <div class="movie-overlay"></div>

        <div class="movie-content">
          <div class="movie-main">
            <img class="movie-poster" src="${poster}" alt="${title || 'Affiche'}">
            <div class="movie-text">
              <h1>${title || "Titre indisponible"}</h1>
              <div class="movie-meta">
                <span>${date || "Date inconnue"}</span>
                <span>${duration}</span>
                <span>Note : ${data.vote_average ? data.vote_average.toFixed(1) : "N/A"}</span>
              </div>
              <p class="movie-genres">${genres}</p>
              <p class="movie-overview">${data.overview || "Aucune description disponible."}</p>
            </div>
          </div>

          <div class="cast-section">
            <h2>Acteurs</h2>
            <div class="cast-row">
              ${castHTML}
            </div>
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    console.error(error);
    detail.innerHTML = "<p>Impossible de charger les données.</p>";
  }
}

init();