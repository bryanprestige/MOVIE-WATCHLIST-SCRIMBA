import reset from '../../css/reset.css' with { type: 'css' }
import css from '../../css/main.css' with { type: 'css' }
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

/**
 * Movie Card Form Web Component
 * @class MovieCardForm
 * @emits 'movie-card'
 */

let movieStorage = []

export class MovieCard extends LitElement {
    static styles = [ css,reset];

    static properties = { 
        title: { type: String },
        rate: { type: String },
        time: { type: String },
        genre: { type: String },
        description: { type: String },
        poster: { type: String },
        imdbId: { type: String },
        favorited: {type: Boolean, state:true},
      };
    
      constructor() {

        super();
      }
      connectedCallback() {
        super.connectedCallback();
        let movieId = this.imdbId
        let movieFavList = JSON.parse(localStorage.getItem('movieList')) || [];
        if (movieFavList.some(favMovie => favMovie === movieId)) {
            this.favorited = true
        }
      }   
    
      displayMovieCardConditions() {
        const currentPage = window.location.pathname;

        return currentPage.includes('watchlist.html') ? 
            html`
             <div class="movie-card">
          <img class="movie-card-image" src="${this.poster}" alt="${this.title} poster">
          <div class="movie-card-info">
            <div class="movie-card-title-rate">
              <h2 class="movie-card-title">${this.title}</h2>
              <h2 class="movie-card-rate">&#127775; ${this.rate}</h2>
            </div>
            <div class="movie-card-time-genre-button">
              <h2 class="movie-card-time">${this.time}</h2>
              <h2 class="movie-card-genre">${this.genre}</h2>
              <button class="remove-movie-button" @click=${this._removeMovie}>&#10133; Remove from watchlist</button>
            </div>
            <p class="movie-card-description">${this.description}</p>
          </div>
        </div>
            ` 
          : 
            html `
             <div class="movie-card">
          <img class="movie-card-image" src="${this.poster}" alt="${this.title} poster">
          <div class="movie-card-info">
            <div class="movie-card-title-rate">
              <h2 class="movie-card-title">${this.title}</h2>
              <h2 class="movie-card-rate">&#127775; ${this.rate}</h2>
            </div>
            <div class="movie-card-time-genre-button">
              <h2 class="movie-card-time">${this.time}</h2>
              <h2 class="movie-card-genre">${this.genre}</h2>
              <button class="movie-card-button ${this.favorited ? 'favorited' : ''}" @click=${this._toggleFavorite}>&#9825; Watchlist</button>
            </div>
            <p class="movie-card-description">${this.description}</p>
          </div>
        </div>
            `
      }

      render() {
        return html`
        ${this.displayMovieCardConditions()}
        `
      }
       /*=========PRIVATE METHODS============*/

          _toggleFavorite() { 
            this.favorited = !this.favorited    
            let movieId = this.imdbId    
            let movieFavList = JSON.parse(localStorage.getItem('movieList')) || [];
            const index = movieFavList.findIndex(favMovie => favMovie === movieId);
            if (index === -1) {
                movieFavList.push(movieId);
        
            } else {
                movieFavList.splice(index, 1);
            }
            localStorage.setItem('movieList', JSON.stringify(movieFavList));
            alert('Movie added to watchlist');
            }

            _removeMovie() {
              let movieId = this.imdbId    
              let movieFavList = JSON.parse(localStorage.getItem('movieList')) || [];
              const index = movieFavList.findIndex(favMovie => favMovie === movieId);
              if (index !== -1) {
                movieFavList.splice(index, 1);
              }
              localStorage.setItem('movieList', JSON.stringify(movieFavList));
              alert('Movie removed from watchlist');
            }
}
customElements.define('movie-card', MovieCard );