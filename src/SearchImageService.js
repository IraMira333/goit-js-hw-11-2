import { Notify } from 'notiflix';
const URL = 'https://pixabay.com/api/';
const API_KEY = '36597774-2e36ba17425207cc180a817c1';
const params = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class SearchImageService {
  constructor() {
    this.page = 1;
    this.query = '';
    this.per_page = 6;
  }
  searchFoto() {
    return fetch(
      `${URL}?key=${API_KEY}&q=${this.query}&${params}&page=${this.page}&per_page=${this.per_page}`
    )
      .then(resp => resp.json())
      .then(({ hits, total }) => {
        if (this.page === 1 && total !== 0) {
          console.log(total);
          Notify.info(`Hoorey! We found ${total} images`);
        }
        this.incrementPage();

        return hits;
      });
  }
  resetPage() {
    this.page = 1;
  }
  incrementPage() {
    this.page += 1;
  }
}
