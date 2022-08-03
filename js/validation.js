"use strict";

// Select all elements from HTML:
let elMoviesWrapper = document.querySelector(".movie__wrapper");
let elForm = document.querySelector(".main__form");
let elInputYear = document.querySelector(".form__year");
let elInputRating = document.querySelector(".form__rating");
let elInputCategory = document.querySelector(".form__categories");
let elInputSorting = document.querySelector(".form__sorting");
let elRenderResult = document.querySelector(".result");
let elMoviesTemplate = document.querySelector(".movies__card").content;

let moviesArray = movies.slice(0, 50);

// Normalize:
let normolizedMovies = moviesArray.map(function (item) {
  return {
    title: item.Title.toString(),
    categories: item.Categories.split("|"),
    info: item.summary,
    img: `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
    videoUrl: `https://www.youtube.com/watch?v=${item.ytid}`,
    rating: item.imdb_rating,
    year: item.movie_year,
  };
});

// Categories:
function getCategories(array) {
  let newArray = [];

  array.forEach((item) => {
    let oneMoviesCategories = item.categories;

    oneMoviesCategories.forEach((item2) => {
      if (!newArray.includes(item2)) {
        newArray.push(item2);
      }
    });
  });

  return newArray;
}
let categoriesArray = getCategories(normolizedMovies).sort();

// Render Categories:
function renderCategories(array, wrapper) {
  let fragment = document.createDocumentFragment();

  for (let item of array) {
    let newOption = document.createElement("option");

    newOption.textContent = item;
    newOption.value = item;
    fragment.appendChild(newOption);
  }
  wrapper.appendChild(fragment);
}
renderCategories(categoriesArray, elInputCategory);

// Render Movies
function renderMovies(array, wrapper) {
  wrapper.innerHTML = null;
  elRenderResult.textContent = array.length;

  let fragment = document.createDocumentFragment();

  for (let item of array) {
    let moviesTemplate = elMoviesTemplate.cloneNode(true);

    moviesTemplate.querySelector(".movie__img").src = item.img;
    moviesTemplate.querySelector(".movie__title").textContent = item.title;
    moviesTemplate.querySelector(".movie__year").textContent = item.year;
    moviesTemplate.querySelector(".movie__rating").textContent = item.rating;
    moviesTemplate.querySelector(".movie__categories").textContent =
      item.categories;
    moviesTemplate.querySelector(".movie__url").href = item.videoUrl;

    fragment.appendChild(moviesTemplate);
  }

  wrapper.appendChild(fragment);
}
renderMovies(normolizedMovies, elMoviesWrapper);

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  let inputYear = elInputYear.value.trim();
  let inputRating = elInputRating.value.trim();
  let inputCategory = elInputCategory.value.trim();
  let inputSorting = elInputSorting.value.trim();

  let filteredArray = normolizedMovies.filter(function (item) {
    let isTrue =
      inputCategory == "all" ? true : item.categories.includes(inputCategory);

    let validation =
      item.year >= inputYear && item.rating >= inputRating && isTrue;

    return validation;
  });

  if (inputSorting == "rating_high-low") {
    filteredArray.sort((a, b) => {
      return b.rating - a.rating;
    });
  }
  if (inputSorting == "rating_low-high") {
    filteredArray.sort((a, b) => {
      return a.rating - b.rating;
    });
  }

  if (inputSorting == "year_high-low") {
    filteredArray.sort((a, b) => {
      return b.year - a.year;
    });
  }
  if (inputSorting == "year_low-high") {
    filteredArray.sort((a, b) => {
      return a.year - b.year;
    });
  }

  if (inputSorting == "a-z") {
    filteredArray.sort();
  }
  if (inputSorting == "a-z") {
    filteredArray.reverse();
  }

  renderMovies(filteredArray, elMoviesWrapper);
});
