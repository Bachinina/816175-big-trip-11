import AbstractComponent from "./abstract-component.js";

export const ButtonMode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const createMenuTemplate = (activeMode) => {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button" ${activeMode === ButtonMode.ADDING ? `disabled` : ``}>New event</button>`;
};

export default class PointAddBtn extends AbstractComponent {
  constructor(activeMode) {
    super();
    this._activeMode = activeMode;

    this._pointAddBtnHandler = null;
  }

  getTemplate() {
    return createMenuTemplate(this._activeMode);
  }

  setPointAddBtnHandler(cb) {
    this.getElement().addEventListener(`click`, () => {
      if (this._activeMode === ButtonMode.ADDING) {
        return;
      }
      this._activeMode = ButtonMode.ADDING;
      cb(this._activeMode);
    });
    this._pointAddBtnHandler = cb;
  }
}

