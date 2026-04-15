let favoritesCache = [];

export const getFavorites = () => favoritesCache;

export const loadFavorites = async () => {
  try {
    const res = await fetch("/api/auth/favorites", { credentials: "include" });
    if (!res.ok) {
      favoritesCache = [];
      return;
    }
    const data = await res.json();
    favoritesCache = data.favorites || [];
  } catch {
    favoritesCache = [];
  }
};

export const isFavorite = (tmdbId, mediaType) => {
  return favoritesCache.some(
    (fav) => fav.tmdbId === tmdbId && fav.mediaType === mediaType
  );
};

export const toggleFavorite = async (tmdbId, mediaType, btn = null) => {
  try {
    const res = await fetch("/api/auth/favorites/toggle", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tmdbId, mediaType }),
    });

    if (res.status === 401) {
      window.location.href = "/LoginPage/index.html";
      return null;
    }

    const data = await res.json();

    favoritesCache = data.favorites;

    if (btn) updateFavBtn(btn, data.action === "added");

    return data.action;
  } catch (err) {
    console.error("Erreur toggle favori :", err);
    return null;
  }
};

export const updateFavBtn = (btn, isActive) => {
  if (isActive) {
    btn.classList.add("fav-active");
    btn.setAttribute("aria-label", "Retirer des favoris");
    btn.innerHTML = `<span class="fav-icon">❤️</span>`;
  } else {
    btn.classList.remove("fav-active");
    btn.setAttribute("aria-label", "Ajouter aux favoris");
    btn.innerHTML = `<span class="fav-icon">🤍</span>`;
  }
};

export const createFavButton = (tmdbId, mediaType) => {
  const btn = document.createElement("button");
  btn.className = "fav-btn";
  btn.dataset.tmdbId = tmdbId;
  btn.dataset.mediaType = mediaType;

  updateFavBtn(btn, isFavorite(tmdbId, mediaType));

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    btn.disabled = true;
    await toggleFavorite(tmdbId, mediaType, btn);
    btn.disabled = false;
  });

  return btn;
};
