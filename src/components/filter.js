import AbstractComponent from "./abstract-component.js";
import {FILTER_TITLES} from "../const.js";


const createFilterItemTemplate = (filters) => {
  return filters.map((filter, i) => {
    return `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${i > 0 ? `` : `checked`}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`;
  }).join(`\n`);
};

export const createFilterTemplate = () => {
  return `<form class="trip-filters" action="#" method="get">
        ${createFilterItemTemplate(FILTER_TITLES)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};


export default class Filter extends AbstractComponent {
  getTemplate() {
    return createFilterTemplate();
  }
}
