import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../const.js";


const createPointDayTemplate = (date, index) => {

  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${MONTHS[date.getMonth()]} ${date.getDate()}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};


export default class PointDay extends AbstractComponent {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createPointDayTemplate(this._date, this._index);
  }
}
