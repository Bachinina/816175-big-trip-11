import AbstractComponent from "./abstract-component.js";


const createStatsTemplate = () => {
  return `<div class="statistics__container">
  <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div></div>
  `;
};


export default class Stats extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  show() {
    this.getElement().parentElement.classList.remove(`statistics--hidden`);
  }

  hide() {
    this.getElement().parentElement.classList.add(`statistics--hidden`);
  }
}
