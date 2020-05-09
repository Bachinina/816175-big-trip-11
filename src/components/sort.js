import AbstractComponent from "./abstract-component.js";

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const createSortItemTemplate = (currentType) => {
  return Object.keys(SortType)
  .map((type) => {
    return `<div class="trip-sort__item  trip-sort__item--${SortType[type]}">
      <input id="${SortType[type]}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType[type]}"
      ${SortType[type] === currentType ? `checked` : ``}>
      <label class="trip-sort__btn" for="${SortType[type]}">${SortType[type]}</label>
    </div>`;
  })
  .join(`\n`);
};

const createSortTemplate = (currentType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${createSortItemTemplate(currentType)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`;
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currenSortType = SortType.EVENT;
  }

  getTemplate() {
    return createSortTemplate(this._currenSortType);
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(cb) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.getAttribute(`name`) === `trip-sort`) {

        const sortType = evt.target.getAttribute(`value`);

        if (this._currenSortType === sortType) {
          return;
        }

        this._currenSortType = sortType;

        cb(this._currenSortType);
      }
    });
  }
}
