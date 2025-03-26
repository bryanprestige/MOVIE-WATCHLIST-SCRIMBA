import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'

export const PORT = location.port ? `:${location.port}` : ''
const apiToken = process.env.API_TOKEN;

document.addEventListener('DOMContentLoaded', () => {

  if (window.location.pathname.includes('index.html')) {
    const searchButton = document.getElementById('search-button')
  searchButton.addEventListener('click', searchMovies)
  } else if (window.location.pathname.includes('watchlist.html')) {
    
  }
  
})

async function searchMovies() {
    const searchValue = document.getElementById('search-input').value
    const apiData = await getAPIData(`https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=${apiToken}&s=${searchValue}`)
    console.log(apiData)  

    const searchResults = apiData.Search
    console.log(searchResults,'searchresults')

    if (searchResults.length === 0) {
      cleanEmptySearchContainer()
      cleanMovieCardContainer()
      const movieCardContainer = document.querySelector('.empty-search');
      const emptySearchContainer = document.createElement('div');
      emptySearchContainer.classList.add('empty-search');
      emptySearchContainer.innerHTML = `<p>No results found for ${searchValue}</p>`;
      movieCardContainer.appendChild(emptySearchContainer);
      return
    } else if (Array.isArray(searchResults)) {
      searchResults.forEach(movie => {
        const imddbID = movie.imdbID
        getEachMovie(imddbID)
      });
    } else {
      createMovieCard(apiData)
    }    
    cleanEmptySearchContainer()
} 

async function getEachMovie(imdbID) {
    const apiData = await getAPIData(`https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=${apiToken}&i=${imdbID}`)
    console.log(apiData)  

    createMovieCard(apiData)
}

function createMovieCard(apiData) {
    const movieCardContainer = document.querySelector('#movie-card-container');
    const movieCard = document.createElement('movie-card')

    if(
      apiData.Poster === 'N/A' ||
      apiData.Plot === 'N/A' || 
      apiData.ImdbRating === 'N/A'||
      apiData.Runtime === 'N/A') {
        apiData.Poster = 'https://placehold.co/90x120'
        apiData.Plot = 'No plot available'
        apiData.ImdbRating = 'No rating available'
        apiData.Runtime = 'No runtime available'
    }
    movieCard.setAttribute('movie', apiData)
    movieCard.setAttribute('title', apiData.Title)
    movieCard.setAttribute('rate', apiData.imdbRating)
    movieCard.setAttribute('time', apiData.Runtime)
    movieCard.setAttribute('genre', apiData.Genre)
    movieCard.setAttribute('description', apiData.Plot)
    movieCard.setAttribute('poster', apiData.Poster)
    movieCard.setAttribute('imdbId', apiData.imdbID) 
    movieCardContainer.appendChild(movieCard)
}

function cleanEmptySearchContainer () {
    const movieCardContainer = document.querySelector('.empty-search');
    movieCardContainer.classList.add('hidden');
}

function cleanMovieCardContainer () {
    const movieCardContainer = document.querySelector('#movie-card-container');
    movieCardContainer.classList.add('hidden');
}

/*=========My Watchist=========*/ 



/* =========APIDATA=========*/ 

export async function getAPIData(apiURL, method = 'GET' , data) {
    let apiData
  
    try {
        let headers = new Headers()

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }

        apiData = await simpleFetch(apiURL, {
          signal: AbortSignal.timeout(3000),
          method: method,
          body: data ?? undefined,
          headers: headers
        });
      } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
        }
        if (err.response.status === 500) {
        }
      }
    }
    return apiData
  }