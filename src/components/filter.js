import {FILTER_TITLES} from "../const.js";

const createFilterList = (filters) => {
  return filters.map((filter, i) => {
    return `<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${i > 0 ? `` : `checked`}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`;
  }).join(`\n`);
};

export const createFilter = () =>
  `<form class="trip-filters" action="#" method="get">
    ${createFilterList(FILTER_TITLES)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  ;
