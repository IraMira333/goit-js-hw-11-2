import { Notify } from 'notiflix';
import { createMarkup } from './createMarkup.js';
import SearchImageService from './SearchImageService.js';

const refs = {
  formEl: document.getElementById('search-form'),
  imagesEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};

const searchImageService = new SearchImageService();

refs.formEl.addEventListener('submit', onSubmit);
refs.loadMoreEl.addEventListener('click', onLoadMore);

function onSubmit(evt) {
  evt.preventDefault();
  const value = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(value);
  if (value === '') return Notify.failure('No search query!');
  else {
    searchImageService.query = value;
    searchImageService.page = 1;
    clearDivGallery();
    getDataForMarkup();
  }
}

function onError(err) {
  Notify.failure(err.message);
  console.error(err);
}

function updateDivGallery(markup) {
  refs.imagesEl.insertAdjacentHTML('beforeend', markup);
}
function clearDivGallery() {
  refs.imagesEl.innerHTML = '';
}

function onLoadMore() {
  getDataForMarkup();
}

function getDataForMarkup() {
  return searchImageService
    .searchFoto()
    .then(hits => {
      console.log(hits);
      if (hits.length === 0)
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
    })
    .then(updateDivGallery)
    .catch(onError);
}
