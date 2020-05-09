import AbstractComponent from "./abstract-component.js";

const createPointDayTemplate = () => {
  return `<li class="trip-days__item  day">
      <div class="day__info"></div>

      <ul class="trip-events__list"></ul>
    </li>`;
};


export default class PointDay extends AbstractComponent {
  getTemplate() {
    return createPointDayTemplate();
  }

  getPointDayInfoBlock() {
    return this.getElement().querySelector(`.day__info`);
  }

  getPointDayListBlock() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
