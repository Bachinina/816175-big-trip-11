import AbstractComponent from "./abstract-component.js";

const createPointListTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class PointList extends AbstractComponent {
  getTemplate() {
    return createPointListTemplate();
  }
}
