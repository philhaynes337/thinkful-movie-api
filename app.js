require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDB = require('./movie-api-data.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


app.use(function validateBearerToken(req, res, next) {
    console.log('Validating');
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.send(401).json({ error: 'Unauthorized Request'})
    };

    next();
});

app.get('/', (req, res) => {
    res.send('Nothing Here');
});



app.get('/movie', (req, res) => {
    let response = MOVIEDB;

    const { genre, country, avg_vote } = req.query;

    if (req.query.genre) {
        response = response.filter(movies =>
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    };

    if (req.query.country) {
        response = response.filter(movies => 
            movies.country.toLowerCase().includes(req.query.country.toLowerCase()))
    };

    if (req.query.avg_vote) {
        response = response.filter(movies =>
            Number(movies.avg_vote) >= Number(req.query.avg_vote)
            )
    };

 

    res.json(response);
})




app.listen(8000, () => {
    console.log('Server has started on port 8000');
});

