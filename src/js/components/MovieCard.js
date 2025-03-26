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
        movie : { type: Object },
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
        if (movieFavList.some(favMovie => favMovie.imdbId === movieId)) {
            this.favorited = true
        }
        
    }   
      render() {
        return html`
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
              <button class="movie-card-button" @click=${this._onWatchlistClick}>&#10133; Watchlist</button>
            </div>
            <p class="movie-card-description">${this.description}</p>
          </div>
        </div>
        `
      }
       /*=========PRIVATE METHODS============*/

       _onWatchlistClick() {

          let movie = this.movie    
          movieStorage.push(movie)
          localStorage.setItem('movieList', JSON.stringify(movieStorage));
          alert('Movie added to watchlist');
      }
}
customElements.define('movie-card', MovieCard );