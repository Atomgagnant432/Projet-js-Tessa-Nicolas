const axios = require('axios');

exports.getMovieDetails = async (req, res) => {
    try {
        const { id, type } = req.params;
        const apiKey = process.env.TMDB_API_KEY;
        
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=fr-FR`;
        const response = await axios.get(url);
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Impossible de récupérer les informations depuis TMDB" });
    }
};