import AbstractSmartComponent from "./abstract-smart-component.js";

export const MenuMode = {
  TABLE: `table`,
  STATS: `stats`,
};

const createMenuTemplate = (activeMode) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn ${activeMode === MenuMode.TABLE ? `trip-tabs__btn--active` : ``}" data-tabs="table" href="#">Table</a>
      <a class="trip-tabs__btn ${activeMode === MenuMode.STATS ? `trip-tabs__btn--active` : ``}" data-tabs="stats" href="#">Stats</a>
    </nav>`;
};

export default class Menu extends AbstractSmartComponent {
  constructor(activeMode) {
    super();
    this._activeMode = activeMode;

    this._menuClickHandler = null;
  }

  getTemplate() {
    return createMenuTemplate(this._activeMode);
  }

  setActiveMode(mode) {
    this._activeMode = mode;
    this.rerender();
  }

  setMenuClickHandler(cb) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      const mode = evt.target.dataset.tabs;
      if (this._activeMode === mode) {
        return;
      }
      this._activeMode = mode;
      cb(this._activeMode);
    });
    this._onChangeHandler = cb;
  }

  recoveryListeners() {
    this.setMenuClickHandler(this._onChangeHandler);
  }

  rerender() {
    super.rerender();
  }
}

