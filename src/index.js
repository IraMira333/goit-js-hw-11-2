import { Notify } from 'notiflix';
import { createMarkup } from './createMarkup.js';
import SearchImageService from './SearchImageService.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.getElementById('search-form'),
  imagesEl: document.querySelector('.gallery'),
};
let gallery;
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
    onLoadMore();
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

async function onLoadMore() {
  loadMoreBtn.disable();
  try {
    const markup = await getDataForMarkup();
    if (!markup) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    updateDivGallery(markup);
    gallery = new SimpleLightbox('a', {
      showCounter: true,
      captions: true,
    }).refresh();
    const { height: cardHeight } =
      imagesEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {}
  loadMoreBtn.enable();
}

async function getDataForMarkup() {
  try {
    const hits = await searchImageService.searchFoto();
    console.log(hits);
    console.log(hits.length);
    console.log(searchImageService.per_page);
    if (hits.length < searchImageService.per_page && hits.length > 0) {
      loadMoreBtn.end();
    }
    if (hits.length === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
  } catch (err) {
    onError(err);
  }

  // return searchImageService
  //   .searchFoto()
  //   .then(hits => {
  //     console.log(hits.length);
  //     console.log(searchImageService.per_page);
  //     if (hits.length < searchImageService.per_page) {
  //       loadMoreBtn.end();
  //     }
  //     if (hits.length === 0) {
  //       throw new Error(
  //         'Sorry, there are no images matching your search query. Please try again.'
  //       );
  //     }
  //     return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
  //   })
  //   .then(updateDivGallery)

  //   .catch(onError);
}
