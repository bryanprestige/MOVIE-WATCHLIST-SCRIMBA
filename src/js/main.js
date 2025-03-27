document.addEventListener('DOMContentLoaded', () => {

  getSpiderman()

  if (window.location.pathname.includes('index.html')) {
    const searchButton = document.getElementById('search-button')
  searchButton.addEventListener('click', searchMovies)
  } else if (window.location.pathname.includes('watchlist.html')) {
    let movieFavList = JSON.parse(localStorage.getItem('movieList')) || [];
    if (movieFavList.length === 0 || movieFavList === null) {
      return
    }
    displayFavMovies()
  }
})

 function getSpiderman() {
  const data = fetch("https://www.omdbapi.com/?apikey=9b9e0974&i=tt0100669")
  .then(res => res.json())
  .then(data => {
      console.log(data)
  })
}

function searchMovies() {
    const searchValue = document.getElementById('search-input').value
    const apiData = fetch(`https://www.omdbapi.com/?apikey=9b9e0974&s=${searchValue}`)
    .then(res => res.json())
  .then(data => {
      data.Search
      console.log(data.Search,'search')
      if (data.Search.length === 0) {
        cleanEmptySearchContainer()
        cleanMovieCardContainer()
        const movieCardContainer = document.querySelector('.empty-search');
        const emptySearchContainer = document.createElement('div');
        emptySearchContainer.classList.add('empty-search');
        emptySearchContainer.innerHTML = `<p>No results found for ${searchValue}</p>`;
        movieCardContainer.appendChild(emptySearchContainer);
        return
      } else if (Array.isArray(data.Search)) {
        data.Search.forEach(movie => {
          const imddbID = movie.imdbID
          getEachMovie(imddbID)
        });
      } else {
        createMovieCard(apiData)
      }    
      cleanEmptySearchContainer()
  })

} 

function getEachMovie(imdbID) {

    const apiData =  fetch(`https://www.omdbapi.com/?apikey=9b9e0974&i=${imdbID}`)
    .then(res => res.json())
    .then(data => {
      console.log(data,'getEachMovie')
      createMovieCard(data)
    })
}

function createMovieCard(data) {
    const movieCardContainer = document.querySelector('#movie-card-container');
    const movieCard = document.createElement('movie-card')

    if(
      data.Poster === 'N/A' ||
      data.Plot === 'N/A' || 
      data.ImdbRating === 'N/A'||
      data.Runtime === 'N/A') {
        return
    } 
    movieCard.setAttribute('title', data.Title)
    movieCard.setAttribute('rate', data.imdbRating)
    movieCard.setAttribute('time', data.Runtime)
    movieCard.setAttribute('genre', data.Genre)
    movieCard.setAttribute('description', data.Plot)
    movieCard.setAttribute('poster', data.Poster)
    movieCard.setAttribute('imdbId', data.imdbID) 
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
  cleanEmptySearchContainer()
  let movieFavList = JSON.parse(localStorage.getItem('movieList')) || [];
  movieFavList.forEach(favMovie => {
    getEachMovie(favMovie)
  });

}

/* =========APIDATA=========*/ 

