
import express, {Router} from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
const api = express();
const router = Router();

/*==========SERVER EXPRESS========== */

router.get( (req, res) => {
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

api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)

export const handler = serverless(api);
