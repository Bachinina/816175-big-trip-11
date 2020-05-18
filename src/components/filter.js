import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilterItemTemplate = (filters) => {
  return filters.map((filter) => {
    const {name, checked, count} = filter;

    return `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${checked ? `checked` : ``}
        ${count === 0 ? `disabled = "disabled"` : ``}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>`;
  }).join(`\n`);
};

export const createFilterTemplate = (filters) => {
  return `<form class="trip-filters" action="#" method="get">
        ${createFilterItemTemplate(filters)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};


export default class Filter extends AbstractSmartComponent {
  constructor(filters, activeFilterType) {
    super();
    this._filters = filters;

    this._activeFilterType = activeFilterType;
    this._filterChangeHandler = null;
    this._filterResetHandler = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(cb) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.getAttribute(`name`) === `trip-filter`) {
        const filterType = evt.target.getAttribute(`value`);

        if (this._activeFilterType === filterType) {
          return;
        }

        this._activeFilterType = filterType;
        cb(this._activeFilterType);
      }
    });
    this._filterChangeHandler = cb;
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
  }
}
