import API from './search.js';
import { Notify } from 'notiflix';
const refs = {
  formEl: document.getElementById('search-form'),
  imagesEl: document.querySelector('.gallery'),
};

refs.formEl.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const value = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(value);
  if (value === '') return Notify.failure('No search query!');
  API.searchFoto(value)
    .then(({ hits }) => {
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

function onError(err) {
  Notify.failure(err.message);
  console.error(err);
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br> ${downloads}
    </p>
  </div>
</div>`;
}

function updateDivGallery(markup) {
  refs.imagesEl.innerHTML = markup;
}
