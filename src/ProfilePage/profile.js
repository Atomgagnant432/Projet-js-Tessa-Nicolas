import { loadFavorites, toggleFavorite, updateFavBtn, isFavorite } from "../Shared/favorites.js";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

(async () => {
  await checkAuth();
  await loadFavorites();
  await renderFavorites();
  setupLogout();    
})();

async function checkAuth() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) {
    window.location.href = "../LoginPage/index.html";
    return;
  }
  const { user } = await res.json();
  document.getElementById("user-name").textContent = user.username;
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-email").textContent = user.email;
}

async function renderFavorites() {
  const carousel = document.getElementById("favorites-carousel");
  const emptyState = document.getElementById("favorites-empty");
  const wrapper = document.getElementById("favorites-carousel-wrapper");

  if (!favorites || favorites.length === 0) {
    emptyState.classList.remove("hidden");
    wrapper.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  wrapper.classList.remove("hidden");
  carousel.innerHTML = "";
  
  const details = await Promise.all(
    favoritesCache.map(({ tmdbId, mediaType }) =>
      fetch(`/api/tmdb-proxy/${mediaType}/${tmdbId}`)
        .then((r) => r.json())
        .then((d) => ({ ...d, mediaType }))
        .catch(() => null)
    )
);

  details.filter(Boolean).forEach((item) => {
    const card = createFavCard(item);
    carousel.appendChild(card);
  });
}

function createFavCard(item) {
  const tmdbId = item.id;
  const mediaType = item.mediaType;
  const title = item.title || item.name;
  const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : "/static/no-poster.png";
  const rating = item.vote_average?.toFixed(1) || "N/A";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-poster-wrapper">
      <img src="${poster}" alt="${title}" class="card-poster" loading="lazy" />
      <div class="card-overlay">
        <p class="card-title">${title}</p>
        <p class="card-meta">⭐ ${rating} · ${year}</p>
      </div>
    </div>
    <button class="fav-btn fav-active remove-btn" aria-label="Retirer des favoris">❤️</button>
  `;

  card.querySelector(".card-poster-wrapper").addEventListener("click", () => {
    window.location.href = `../DetailPage/index.html?id=${tmdbId}&type=${mediaType}`;
  });

  const btn = card.querySelector(".fav-btn");
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    btn.disabled = true;
    const action = await toggleFavorite(tmdbId, mediaType, btn);
    if (action === "removed") {
      card.classList.add("card-removing");
      card.addEventListener("animationend", () => card.remove());

      const carousel = document.getElementById("favorites-carousel");
      if (carousel.children.length === 0) {
        document.getElementById("favorites-empty").classList.remove("hidden");
        document.getElementById("favorites-carousel-wrapper").classList.add("hidden");
      }
    }
    btn.disabled = false;
  });

  return card;
}

function setupLogout() {
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    window.location.href = "../LoginPage/index.html";
  });
}