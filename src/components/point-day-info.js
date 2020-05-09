import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../const.js";

const createPointDayInfoTemplate = (date, index) => {
  return `<div>
    <span class="day__counter">${index + 1}</span>
    <time class="day__date" datetime="2019-03-18">${MONTHS[date.getMonth()]} ${date.getDate()}</time>
  </div>`;
};


export default class PointDayInfo extends AbstractComponent {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createPointDayInfoTemplate(this._date, this._index);
  }
}
