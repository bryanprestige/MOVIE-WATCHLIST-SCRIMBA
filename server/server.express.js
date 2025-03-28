import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = process.env.port
const apiToken = process.env.API_TOKEN;
const ip = process.env.IP;

app.use(express.static('src'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Content-Security-Policy', "default-src 'self';");
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

app.get('/api/movies', async (req, res) => {
  try {
    const apiUrl = `http://www.omdbapi.com/?apikey=9b9e0974`;
    const queryParams = req.query;
    const url = `${apiUrl}&${Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&')}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, ip, () => {
  console.log(`Example app listening on ${port}:${ip}`);
})