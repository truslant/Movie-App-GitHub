require('dotenv').config();

const express = require('express');
const router = express.Router();

const axios = require('axios');

const apiKey = process.env.API_KEY;

const apiBaseUrl = 'http://localhost:3000';
const nowPlayingUrl = `${apiBaseUrl}/most_popular?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(nowPlayingUrl);
  axios.get(nowPlayingUrl)
    .then(answer => {
      console.log(answer.data.result);
      res.render('index', {
        moviesData: answer.data.result
      });
    })
});

router.get('/movie/:movieId', (req, res, next) => {
  const { movieId } = req.params;
  const movieURL = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  axios.get(movieURL)
    .then(movie => {
      console.log(movie.data);
      res.render('single-movie', {
        movie: movie.data.result
      });
    })
});

router.post('/search', (req, res, next) => {
  const { cat, movieSearch } = req.body;

  const searchUrl = `${apiBaseUrl}/search/${cat}?query=${encodeURI(movieSearch)}&api_key=${apiKey}`;

  axios.get(searchUrl)
    .then(data => {
      let parsedData = data.data.results
      if (cat == "person") {
        parsedData = data.data.results[0].known_for;
      }

      res.render('index', {
        moviesData: parsedData
      });

    })
});

module.exports = router;
