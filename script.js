'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
let coords = [];
let capital;
let mymap;
///////////////////////////////////////
function renderCountry(data, className = '') {
  console.log(data);
  const html = `
      <article class="country ${className}" data-search='${data.name.common}'>
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <a class="country__name" target='_blank' href='${
          data.maps.openStreetMaps
        }'>${data.name.official}
        </a>
              <h4 class="country__region"><small>${
                Object.values(data.name.nativeName)[0].common
              }</small>${data.subregion}</h4>
        <p class="country__row population"><span>👫</span>        ${
          +data.population > 1000000000
            ? (data.population / 1000000000).toFixed(1) + ' B.'
            : (data.population / 1000000).toFixed(1) + ' M.'
        } people</p>
        <p class="country__row language"><span>🗣️</span>${Object.values(
          data.languages
        )}</p>
        <p class="country__row currency"><span>💰</span>${
          String(Object.values(Object.values(data.currencies)[0])[0]) +
          ' ' +
          '(' +
          Object.values(Object.values(data.currencies)[0])[1] +
          ')'
        }</p>
        <p class="country__row area"><span>🗺</span>
        ${
          +data.area > 1000000
            ? (data.area / 1000000).toFixed(1) + ' M.'
            : (data.area / 1000).toFixed(1) + ' Th.'
        } km<sup>2</sup></p>
        <a class="country__row capital" target='_blank' href='https://www.google.com/maps/place/${
          data.capital
        }'><span>🛕</span>${data.capital}</a>
       
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}
const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/translation/${country}`);
  request.send();
  request.addEventListener('load', function (e) {
    const [data] = JSON.parse(this.responseText);
    // RENDER country 1
    renderCountry(data);
    capital = data.capital[0];
    coords = data.capitalInfo.latlng;
    // GET NEIGHBOUR country
    const neighbours = data.borders;
    if (!neighbours) return;
    // AJAX call country 2
    neighbours.forEach((neighbour, i) => {
      const request2 = new XMLHttpRequest();
      request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
      request2.send();
      request2.addEventListener('load', function (e) {
        const [data2] = JSON.parse(this.responseText);
        renderCountry(data2, 'neighbour');
      });
    });
  });
};
const inp = document.querySelector('.form input');
btn.addEventListener('click', function (e) {
  e.preventDefault();
  countriesContainer.innerHTML = ' ';
  const text = inp.value;
  getCountryAndNeighbour(text);
});

inp.addEventListener('keydown', function (e) {
  if (e.code === 'Enter' || e.code === 'NumpadEnter') {
    countriesContainer.innerHTML = ' ';
    getCountryAndNeighbour(this.value);
  }
});
// FETCH
function getCountryData(country) {
  fetch(`https://restcountries.com/v3.1/translation/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;
    });
}
countriesContainer.addEventListener('dblclick', function (e) {
  countriesContainer.innerHTML = ' ';
  getCountryAndNeighbour(
    e.target.closest('.country').getAttribute('data-search')
  );
});
