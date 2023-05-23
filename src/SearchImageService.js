const URL = 'https://pixabay.com/api/';
const API_KEY = '36597774-2e36ba17425207cc180a817c1';
const params =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=6';

export default class SearchImageService {
  constructor() {
    this.page = 1;
    this.query = '';
  }
  searchFoto() {
    return fetch(
      `${URL}?key=${API_KEY}&q=${this.query}&${params}&page=${this.page}`
    )
      .then(resp => resp.json())
      .then(({ hits }) => {
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
