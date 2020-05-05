import {MONTHS} from "../const.js";
import {createElement} from "../utils.js";


const createPointDayTemplate = (date, index) => {

  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${MONTHS[date.getMonth()]} ${date.getDate()}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};


export default class PointDay {
  constructor(date, index) {
    this._date = date;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createPointDayTemplate(this._date, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
