import express, { Router } from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import axios from 'axios';

const api = express();
const router = Router();

router.get('/movies', async (req, res) => {
  try {
    const apiUrl = `http://www.omdbapi.com/?apikey=9b9e0974`;
    const queryParams = req.query;
    const url = `${apiUrl}&${Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&')}`;
    console.log('Making request to:', url);

    const response = await axios.get(url);
    console.log('Received response from OMDB API:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use('/api/', router);

export const handler = serverless(api);