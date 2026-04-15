# NetflixLight (Projet JS)

Projet scolaire en JavaScript/Node.js : mini-plateforme de streaming (catalogue via TMDB) avec authentification, favoris et pages dédiées (Accueil, Films, Séries, Profil).

## Prérequis

- Node.js + npm installés

## Installation

```bash
npm install
```

## Configuration (.env)

Créer/compléter le fichier `.env` à la racine :

```env
Jeton_tmdb= [le token]
```

Notes :
- Le projet utilise un token TMDB v4 (Bearer). Sans ce token, les carrousels et la recherche ne fonctionneront pas.

## Lancer le serveur

```bash
node .\server.js
```

Le serveur démarre sur :
- `http://localhost:3030`

## Pages

- Connexion : `http://localhost:3030/LoginPage/index.html`
- Inscription : `http://localhost:3030/LoginPage/register.html`
- Accueil (carrousels actuels) : `http://localhost:3030/HomePage/index.html`
- Films (carrousels par genre) : `http://localhost:3030/FilmPage/index.html`
- Séries (carrousels par genre) : `http://localhost:3030/SeriePage/index.html`
- Profil (watchlist) : `http://localhost:3030/ProfilePage/index.html`
- Détail film/série + bande-annonce : `http://localhost:3030/HomePage/movie.html?id=...&type=movie|tv`

## API (résumé)

Base : `/api/auth`

- `POST /api/auth/register` : `{ email, pseudo, password }`
- `POST /api/auth/login` : `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me` (protégé, session)
- `GET /api/auth/favorites` (protégé)
- `POST /api/auth/favorites/toggle` (protégé) : `{ tmdbId, mediaType }`
- `GET /api/auth/tmdb-proxy/:type/:id` (protégé) : proxy détails (movie/tv)
- `GET /api/auth/tmdb-proxy-list?url=...` (protégé) : proxy d’URL TMDB (listes/carrousels)

Autre :
- `GET /api/config` : renvoie le token (utilisé côté front pour certaines pages)

## Données
- Les utilisateurs sont stockés dans `data/user.json` (JSON local).
- Les favoris sont stockés dans le même fichier, par utilisateur, dans `favorites`.

## Dépannage
- Si les carrousels affichent "Impossible de charger le carrousel", vérifier :
  - que `Jeton_tmdb` est présent dans `.env`
  - que le réseau/la machine autorise les requêtes sortantes vers `https://api.themoviedb.org`

## Structure (simplifiée)
- `server.js` : serveur Express + sessions + statiques
- `controllers/` : logique auth/favoris/TMDB proxy
- `src/` : pages front (LoginPage, HomePage, FilmPage, SeriePage, ProfilePage, Shared)

## Arborescence

(`node_modules/` et `.git/` sont volontairement omis)

```text
.
├─ server.js
├─ package.json
├─ package-lock.json
├─ .env
├─ .gitignore
├─ README.md
├─ app.js
├─ controllers/
│  ├─ authcontroller.js
│  ├─ favcontroller.js
│  └─ moviecontroller.js
├─ data/
│  └─ user.json
├─ static/
│  └─ .gitkeep
├─ cmd/
│  └─ .gitkeep
└─ src/
   ├─ FilmPage/
   │  ├─ index.html
   │  ├─ script.js
   │  └─ style.css
   ├─ SeriePage/
   │  ├─ index.html
   │  ├─ script.js
   │  └─ style.css
   ├─ HomePage/
   │  ├─ index.html
   │  ├─ movie.html
   │  ├─ movie.js
   │  ├─ script.js
   │  ├─ search.js
   │  └─ style.css
   ├─ LoginPage/
   │  ├─ auth.js
   │  ├─ index.html
   │  ├─ register.html
   │  ├─ script.js
   │  └─ style.css
   ├─ ProfilePage/
   │  ├─ index.html
   │  ├─ profile.js
   │  └─ style.css
   ├─ Shared/
   │  ├─ base.css
   │  ├─ components.css
   │  ├─ favorite.js
   │  └─ variables.css
   ├─ middlewares/
   │  └─ middlewares.js
   ├─ model/
   │  └─ user.js
   └─ routes/
      └─ routeauth.js
```
