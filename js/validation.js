"use strict";

// Select all elements from HTML:
let closed = document.querySelector(".close");
let coutionClose = document.querySelector(".coution");
let elMoviesWrapper = document.querySelector(".movie__wrapper");
let elForm = document.querySelector(".main__form");
let elInputSearch = document.querySelector(".form__title");
let elInputYear = document.querySelector(".form__year");
let elInputRating = document.querySelector(".form__rating");
let elInputCategory = document.querySelector(".form__categories");
let elInputSorting = document.querySelector(".form__sorting");
let elMovieTitle = document.querySelector(".movie__title");
let elMovieAbout = document.querySelector(".movie__about");
let elTotalResult = document.querySelector(".total__result");
let elSearchResult = document.querySelector(".result");
let elMoviesTemplate = document.querySelector("#movie_card").content;
let elPaginationWrapper = document.querySelector(".pagination__wrapper");
let elBookmarkedList = document.querySelector(".bookmark__list");
let elBookmarkedTemplate = document.querySelector("#bookmarkedItem").content;

// Settings:
let itemsPerPage = 10;
let currentPage = 1;
let pages;


let localMovies = JSON.parse(localStorage.getItem("bookmarkedMovies"));
let bookmarkedMovies = localMovies ? localMovies : [];


renderBookmarks(bookmarkedMovies);

let moviesArray = movies.slice(0, 100);

// Normalize:
let normolizedMovies = moviesArray.map(function (item) {
  return {
    id: item.imdb_id,
    about: item.summary,
    title: item.Title.toString(),
    fullTitle: item.fulltitle.toString(),
    categories: item.Categories.split("|"),
    info: item.summary,
    img: `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
    videoUrl: `https://www.youtube.com/watch?v=${item.ytid}`,
    rating: item.imdb_rating,
    year: item.movie_year,
  };
});
let filteredArray = normolizedMovies;

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
function renderMovies(array) {
  elSearchResult.textContent = array.length;
  elMoviesWrapper.innerHTML = null;

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
    moviesTemplate.querySelector(".movie__about").dataset.movieId = item.id;
    moviesTemplate
      .querySelector(".movie__url")
      .setAttribute("_target", "blank");
    moviesTemplate.querySelector(".bookmark__btn").dataset.bookmarkId = item.id;

    fragment.appendChild(moviesTemplate);
  }

  elMoviesWrapper.appendChild(fragment);
}
renderMovies(filteredArray.slice(0, itemsPerPage));
renderPageBtns(filteredArray);

function getElementsOfPage(array, perPage, currentPage) {
  let result = [];

  if (currentPage == 1) {
    result = array.slice(0, perPage);
  } else {
    result = array.slice(perPage * (currentPage - 1), perPage * currentPage);
  }

  return result;
}

let currentRender = getElementsOfPage(normolizedMovies, itemsPerPage, 4);
elTotalResult.textContent = normolizedMovies.length;

function renderPageBtns(array) {
  elPaginationWrapper.innerHTML = null;
  pages = Math.ceil(array.length / itemsPerPage);

  let fragment = document.createDocumentFragment();

  if (pages > 1) {
    for (let i = 1; i <= pages; i++) {
      let newBtn = document.createElement("button");
      newBtn.setAttribute("class", "render__btns btn btn-outline-primary");
      newBtn.textContent = i.toString();
      newBtn.dataset.pageNumber = i.toString();

      fragment.appendChild(newBtn);
    }
  }
  elPaginationWrapper.appendChild(fragment);
}

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  let inputSearch = elInputSearch.value.trim();

  let pattern = new RegExp(inputSearch, "gi");

  let inputYear = elInputYear.value.trim();
  let inputRating = elInputRating.value.trim();
  let inputCategory = elInputCategory.value.trim();
  let inputSorting = elInputSorting.value.trim();

  filteredArray = normolizedMovies.filter(function (item) {
    let isTrue =
      inputCategory == "all" ? true : item.categories.includes(inputCategory);

    let searchByName = item.title.match(pattern);
    let validation =
      item.year >= inputYear &&
      item.rating >= inputRating &&
      isTrue &&
      searchByName;

    return validation;
  });

  filteredArray.sort(function (a, b) {
    if (inputSorting == "rating_high-low") {
      return b.rating - a.rating;
    }
    if (inputSorting == "rating_low-high") {
      return a.rating - b.rating;
    }

    if (inputSorting == "year_high-low") {
      return b.year - a.year;
    }
    if (inputSorting == "year_low-high") {
      return a.year - b.year;
    }

    if (inputSorting == "a-z") {
      let firstValue = a.title.toLowerCase();
      let secondValue = b.title.toLowerCase();
      return firstValue == secondValue ? 0 : firstValue < secondValue ? -1 : 1;
    }

    if (inputSorting == "z-a") {
      let firstValue = a.title.toLowerCase();
      let secondValue = b.title.toLowerCase();
      return firstValue == secondValue ? 0 : firstValue < secondValue ? 1 : -1;
    }
  });

  renderMovies(
    filteredArray.slice(
      (currentPage - 1) * itemsPerPage,
      itemsPerPage * currentPage
    )
  );
  renderPageBtns(filteredArray);
  elTotalResult.textContent = filteredArray.length;
});

// Coution Close:
closed.addEventListener("click", () => {
  coutionClose.style.display = "none";
});

// elBookmarkedList.innerHTML = null
document.addEventListener("click", function (evt) {
  const currentMovieId = evt.target.dataset.movieId;
  const currentBookmarkId = evt.target.dataset.bookmarkId;

  if (currentMovieId) {
    let foundMovie = normolizedMovies.find(function (item) {
      return item.id == currentMovieId;
    });

    elMovieTitle.textContent = foundMovie.fullTitle;
    elMovieAbout.textContent = foundMovie.about;
  }

  if (currentBookmarkId) {
    let foundMovie = normolizedMovies.find(function (item) {
      return item.id == currentBookmarkId;
    });

    if (bookmarkedMovies.length == 0) {
      bookmarkedMovies.unshift(foundMovie);
      localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies));
    } else {
      let isMovieInArray = bookmarkedMovies.find(function (item) {
        return item.title == foundMovie.title;
      });
      if (!isMovieInArray) {
        bookmarkedMovies.unshift(foundMovie);
        localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies));
      }
    }
    renderBookmarks(bookmarkedMovies);
  }
});

function renderBookmarks(arrayOfMovies) {
  elBookmarkedList.innerHTML = null;

  let fragment = document.createDocumentFragment();

  for (const item of arrayOfMovies) {
    let bookmarkItem = elBookmarkedTemplate.cloneNode(true);

    bookmarkItem.querySelector(".bookmark__title").textContent = item.title;
    bookmarkItem.querySelector(".bookmark__btn").dataset.bookmarkId = item.id;
    bookmarkItem.querySelector(".movie__url").href = item.videoUrl;
    bookmarkItem.querySelector(".movie__about").dataset.movieId = item.id;
    bookmarkItem.querySelector(".movie__url").setAttribute("_target", "blank");

    fragment.appendChild(bookmarkItem);
  }

  elBookmarkedList.appendChild(fragment);
}

elBookmarkedList.addEventListener("click", function (evt) {
  let bookmarkedMovieId = evt.target.dataset.bookmarkId;

  if (bookmarkedMovieId) {
    let foundBookmarkMovie = bookmarkedMovies.findIndex(function (item) {
      return item.id == bookmarkedMovieId;
    });

    bookmarkedMovies.splice(foundBookmarkMovie, 1);
    localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies));
  }
  renderBookmarks(bookmarkedMovies);
});

elPaginationWrapper.addEventListener("click", function (evt) {
  let currentPage = evt.target.closest(".render__btns");

  if (currentPage) {
    let currentPageValue = currentPage.textContent;
    let btnsWrapper = elPaginationWrapper.querySelectorAll(".active");

    btnsWrapper.forEach((item) => {
      item.classList.remove("active");
    });

    currentPage.classList.add("active");

    renderMovies(
      filteredArray.slice(
        (currentPageValue - 1) * itemsPerPage,
        itemsPerPage * currentPageValue
      )
    );
  }
  // elSearchResult.textContent = result.length;
});
