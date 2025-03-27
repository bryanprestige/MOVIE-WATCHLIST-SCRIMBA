import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'

export const PORT = location.port ? `:${location.port}` : ''

document.addEventListener('DOMContentLoaded', () => {

  if (window.location.pathname.includes('index.html')) {
    const searchButton = document.getElementById('search-button')
  searchButton.addEventListener('click', searchMovies)
  } else if (window.location.pathname.includes('watchlist.html')) {
    displayFavMovies()
  }
  
})

async function searchMovies() {
    const searchValue = document.getElementById('search-input').value
    const apiData = await getAPIData(`https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=9b9e0974&s=${searchValue}`)

    const searchResults = apiData.Search

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
    const apiData = await getAPIData(`https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=9b9e0974&i=${imdbID}`)

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
        return
    } 
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

function displayFavMovies() {
  let movieFavList = JSON.parse(localStorage.getItem('movieList')) || [];

  movieFavList.forEach(favMovie => {
    getEachFavMovie(favMovie)
  });
}

async function getEachFavMovie(favMovie) {
  const apiData = await getAPIData(`https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=9b9e0974&i=${favMovie}`)

  if(apiData.length === 0) {
    return
  }else{
    cleanEmptySearchContainer()
    createMovieCardFav(apiData)
  }
}

function createMovieCardFav(apiData) {
  const movieCardContainer = document.querySelector('#movie-card-container-watchlist');
  const movieCard = document.createElement('movie-card')

  if(
    apiData.Poster === 'N/A' ||
    apiData.Plot === 'N/A' || 
    apiData.ImdbRating === 'N/A'||
    apiData.Runtime === 'N/A') {
      return
  } 

  movieCard.setAttribute('title', apiData.Title)
  movieCard.setAttribute('rate', apiData.imdbRating)
  movieCard.setAttribute('time', apiData.Runtime)
  movieCard.setAttribute('genre', apiData.Genre)
  movieCard.setAttribute('description', apiData.Plot)
  movieCard.setAttribute('poster', apiData.Poster)
  movieCard.setAttribute('imdbId', apiData.imdbID) 
  movieCardContainer.appendChild(movieCard)
}


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