import express from 'express';
import bodyParser from 'body-parser';


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

app.get('/api', (req, res) => {
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiToken}`;
  const queryParams = req.query;
  const url = `${apiUrl}&${Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&')}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });npm
    });
});


app.listen(port, ip, () => {
  console.log(`Example app listening on ${ip}:${port}`)
})
