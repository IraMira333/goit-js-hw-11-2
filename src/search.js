const URL = 'https://pixabay.com/api/';
const API_KEY = '36597774-2e36ba17425207cc180a817c1';
const params =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=6';

//https://pixabay.com/api/?key=36597774-2e36ba17425207cc180a817c1&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true

function searchFoto(query, page = 1) {
  return fetch(`${URL}?key=${API_KEY}&q=${query}&${params}&page=${page}`).then(
    resp => resp.json()
  );
}

export default { searchFoto };
