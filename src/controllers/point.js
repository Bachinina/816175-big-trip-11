import PointComponent from '../components/point.js';
import PointEditComponent from '../components/point-edit.js';

import {render, replace, RenderPosition} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, allDestinations, allOffers, onDataChange, onViewChange) {
    this._mode = Mode.DEFAULT;
    this._container = container;

    // Все возможные пункты назначения с описанием и фото
    this._allDestinations = allDestinations;

    this._allOffers = allOffers;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;


    this._point = null;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._replacePointToEdit = this._replacePointToEdit.bind(this);
    this._replaceEditToPoint = this._replaceEditToPoint.bind(this);
  }

  getPoint() {
    return this._point;
  }

  render(point) {
    this._point = point;

    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(this._point);
    this._pointEditComponent = new PointEditComponent(this._point, this._allDestinations, this._allOffers);
    this._pointComponent.setEditButtonClickHandler(this._replacePointToEdit);

    this._pointEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });
    this._pointEditComponent.setCloseButtonClickHandler(this._replaceEditToPoint);

    this._pointEditComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this._point, Object.assign({}, this._point, {
        [`is-favorite`]: !this._point[`is-favorite`],
      }));
    });

    if (oldPointComponent && oldPointEditComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    this._pointEditComponent.reset();
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToPoint();
    }
  }
}
