import { loadFavorites, createFavButton } from "../Shared/favorite.js";

const IMG_PATH = "https://image.tmdb.org/t/p/w300";

async function fetchList(url) {
  const res = await fetch(`/api/auth/tmdb-proxy-list?url=${encodeURIComponent(url)}`, {
    credentials: "include",
  });

  if (res.status === 401) {
    window.location.href = "/LoginPage/index.html";
    return null;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || data?.error || "Erreur TMDB");
  }

  return res.json();
}

function createCard(item, mediaType) {
  const title = mediaType === "tv" ? item.name : item.title;
  const posterUrl = item.poster_path ? `${IMG_PATH}${item.poster_path}` : "/static/no-poster.png";

  const card = document.createElement("div");
  card.className = "movie-card";
  card.innerHTML = `
    <img src="${posterUrl}" alt="${title || "Affiche"}" loading="lazy" />
    <div class="card-info">
      <div class="card-title">${title || "Titre indisponible"}</div>
      <div class="card-meta">⭐ ${item.vote_average ? item.vote_average.toFixed(1) : "N/A"}</div>
    </div>
  `;

  const favBtn = createFavButton(item.id, mediaType);
  card.appendChild(favBtn);

  card.addEventListener("click", () => {
    window.location.href = `/HomePage/movie.html?id=${item.id}&type=${mediaType}`;
  });

  return card;
}

async function init() {
  await loadFavorites();

  document.querySelectorAll(".carousel").forEach((carousel) => {
    const row = carousel.querySelector(".movie-row");
    const leftBtn = carousel.querySelector(".left");
    const rightBtn = carousel.querySelector(".right");
    const url = carousel.dataset.url;
    const type = carousel.dataset.type || (url.includes("/tv/") ? "tv" : "movie");

    leftBtn?.addEventListener("click", () => (row.scrollLeft -= 340));
    rightBtn?.addEventListener("click", () => (row.scrollLeft += 340));

    (async () => {
      try {
        const data = await fetchList(url);
        if (!data) return;
        row.innerHTML = "";
        (data.results || []).forEach((item) => row.appendChild(createCard(item, type)));
      } catch (err) {
        console.error(err);
        row.innerHTML = `<p>Impossible de charger le carrousel (${err?.message || "erreur"}).</p>`;
      }
    })();
  });
}

init();

