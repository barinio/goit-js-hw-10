import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const API_KEY =
  'live_TrtUTrFwjdGrNwpoLVa4D2WdU80dYEEOFZrDqLRJrY6WbvuT3eaVQSHTkuQHi7KB';
axios.defaults.headers.common['x-api-key'] = API_KEY;

const refs = {
  select: document.querySelector('.breed-select'),
  div: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
};

refs.select.classList.add('is-hidden');
refs.div.classList.add('is-hidden');

refs.select.addEventListener('change', selectCatBreed);

fetchBreeds()
  .then(dataArr => {
    setTimeout(() => {
      refs.loader.classList.add('is-hidden');
      refs.select.classList.remove('is-hidden');
      refs.select.innerHTML = createSelectMarkup(dataArr);
      new SlimSelect({
        select: refs.select,
      });
    }, 500);
  })
  .catch(err => {
    setTimeout(() => {
      refs.select.classList.add('is-hidden');
      refs.loader.classList.add('is-hidden');
      Notify.failure(`${err}`);
    }, 500);
  });

function createSelectMarkup(arr) {
  return arr
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join('');
}

function selectCatBreed(e) {
  const breedId = e.target.value;
  fetchCatByBreed(breedId)
    .then(catData => {
      refs.loader.classList.remove('is-hidden');
      refs.div.classList.add('is-hidden');
      fetchBreeds()
        .then(dataBreeds => {
          refs.loader.classList.add('is-hidden');
          refs.div.classList.remove('is-hidden');
          const selectedBreed = dataBreeds.find(breed => breed.id === breedId);
          refs.div.innerHTML = createCatInfo(catData, selectedBreed);
        })
        .catch(err => {
          Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });
    })
    .catch(err => console.log(err));
}
function createCatInfo(catData, breedData) {
  return `<img src="${catData[0].url}" alt="${breedData.name}" width = 400>
	<div class="content"><h2>${breedData.name}</h2>
    <p><span class="breed-text">Description:</span> ${breedData.description}</p>
    <p><span class="breed-text">Temperament:</span> ${breedData.temperament}</p></div>`;
}
