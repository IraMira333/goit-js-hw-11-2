import { Notify } from 'notiflix';
import { createMarkup } from './createMarkup.js';
import SearchImageService from './SearchImageService.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';
const refs = {
  formEl: document.getElementById('search-form'),
  imagesEl: document.querySelector('.gallery'),
};

const searchImageService = new SearchImageService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.formEl.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', onLoadMore);

function onSubmit(evt) {
  evt.preventDefault();
  const value = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(value);
  if (value === '') return Notify.failure('No search query!');
  else {
    searchImageService.query = value;
    searchImageService.page = 1;
    loadMoreBtn.show();
    clearDivGallery();
    loadMoreBtn.disable();
    getDataForMarkup().then(() => loadMoreBtn.enable());
  }
}

function onError(err) {
  Notify.failure(err.message);
  console.error(err);
  loadMoreBtn.hide();
}

function updateDivGallery(markup) {
  refs.imagesEl.insertAdjacentHTML('beforeend', markup);
}
function clearDivGallery() {
  refs.imagesEl.innerHTML = '';
}

function onLoadMore() {
  loadMoreBtn.disable();
  getDataForMarkup().then(() => loadMoreBtn.enable());
}

function getDataForMarkup() {
  return searchImageService
    .searchFoto()
    .then(hits => {
      console.log(hits.length);
      console.log(searchImageService.per_page);
      if (hits.length < searchImageService.per_page) {
        loadMoreBtn.end();
      }
      if (hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
    })
    .then(updateDivGallery)

    .catch(onError);
}
