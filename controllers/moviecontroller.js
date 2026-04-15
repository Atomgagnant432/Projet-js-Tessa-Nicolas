const axios = require('axios');

const TMDB_API_PREFIX = "https://api.themoviedb.org/3/";

function getTmdbToken() {
  return process.env.Jeton_tmdb || process.env.TMDB_API_KEY || "";
}

function authHeaders() {
  const token = getTmdbToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

exports.getMovieDetails = async (req, res) => {
  try {
    const { id, type } = req.params;
    const headers = authHeaders();
    if (!headers) return res.status(500).json({ error: "Clé TMDB manquante dans .env" });

    const url = `https://api.themoviedb.org/3/${type}/${id}?language=fr-FR`;
    const response = await axios.get(url, { headers });

    res.json(response.data);
  } catch (error) {
    const hasResponse = !!error?.response;
    const status = error?.response?.status || (hasResponse ? 500 : 502);
    const data = error?.response?.data;
    const code = error?.code || error?.cause?.code;

    let detail =
      data?.status_message ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      error?.message ||
      error?.toString?.() ||
      "";

    if (!detail || detail === "Erreur inconnue") detail = code || "Erreur inconnue";

    console.error("TMDB getMovieDetails error:", { status, code, detail });
    res.status(status).json({ error: "TMDB_ERROR", detail, code });
  }
};

exports.proxyList = async (req, res) => {
  try {
    const { url } = req.query;
    const headers = authHeaders();
    if (!headers) return res.status(500).json({ error: "Clé TMDB manquante dans .env" });
    if (!url || typeof url !== "string") return res.status(400).json({ error: "Paramètre url requis" });
    if (!url.startsWith(TMDB_API_PREFIX)) return res.status(400).json({ error: "URL TMDB invalide" });

    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    const hasResponse = !!error?.response;
    const status = error?.response?.status || (hasResponse ? 500 : 502);
    const data = error?.response?.data;
    const code = error?.code || error?.cause?.code;

    let detail =
      data?.status_message ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      error?.message ||
      error?.toString?.() ||
      "";

    if (!detail || detail === "Erreur inconnue") detail = code || "Erreur inconnue";

    console.error("TMDB proxyList error:", { status, code, detail });
    res.status(status).json({ error: "TMDB_ERROR", detail, code });
  }
};
