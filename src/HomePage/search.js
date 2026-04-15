const IMG_PATH_SEARCH = "https://image.tmdb.org/t/p/w500";

async function initSearch() {
  const res = await fetch('/api/config');
  const config = await res.json();
  const API_KEY = config.tmdbKey;

  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('search-results');

  if (!searchInput || !resultsContainer) return;

  async function searchContent(query) {
    if (!query.trim()) {
      resultsContainer.innerHTML = "";
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=fr-FR&page=1`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();
      const filtered = (data.results || []).filter(
        item => item.media_type === "movie" || item.media_type === "tv"
      );

      if (!filtered.length) {
        resultsContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
        return;
      }

      resultsContainer.innerHTML = filtered.map(item => {
        const title = item.media_type === "tv" ? item.name : item.title;
        const type = item.media_type;
        const posterUrl = item.poster_path
          ? `${IMG_PATH_SEARCH}${item.poster_path}`
          : "https://via.placeholder.com/500x750?text=Pas+d'image";

        return `
          <div class="movie-card" data-id="${item.id}" data-type="${type}">
            <img src="${posterUrl}" alt="${title || 'Affiche'}">
            <div class="card-info">
              <div class="card-title">${title || "Titre indisponible"}</div>
              <div class="card-meta">${type === "tv" ? "Série" : "Film"}</div>
            </div>
          </div>
        `;
      }).join("");

      resultsContainer.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
          window.location.href = `movie.html?id=${card.dataset.id}&type=${card.dataset.type}`;
        });
      });
    } catch (error) {
      console.error("Erreur recherche :", error);
      resultsContainer.innerHTML = "<p>Erreur lors de la recherche.</p>";
    }
  }

  searchInput.addEventListener('input', () => {
    searchContent(searchInput.value);
  });
}

initSearch();