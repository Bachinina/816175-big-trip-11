import PointComponent from '../components/point.js';
import PointEditComponent from '../components/point-edit.js';

import {render, replace, remove, RenderPosition} from "../utils/render.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};


export const EmptyPoint = {
  type: `bus`,
  [`base-price`]: ``,
  [`date-from`]: new Date(),
  [`date-to`]: new Date(),
  [`destination`]: {
    "description": ``,
    "name": ``,
    "pictures": []
  },
  id: String(new Date() + Math.random()),
  [`is-favorite`]: false,
  [`offers`]: [],
};

export default class PointController {
  constructor(container, pointsModel, onDataChange, onViewChange) {
    this._mode = null;
    this._pointsModel = pointsModel;
    this._container = container;

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

  getMode() {
    return this._mode;
  }

  render(point, mode, openEditForm = false) {
    this._point = point;
    this._mode = mode;

    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(this._point);
    this._pointEditComponent = new PointEditComponent(this._point, this._pointsModel, this._mode);

    this._pointEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._pointEditComponent.getData();
      this._onDataChange(point, data);
    });

    switch (mode) {
      case Mode.DEFAULT:
        this._pointComponent.setEditButtonClickHandler(this._replacePointToEdit);
        this._pointEditComponent.setFavoriteButtonClickHandler(() => {
          this._onDataChange(this._point, Object.assign({}, this._point, {
            [`is-favorite`]: !this._point[`is-favorite`],
          }), true);
        });
        this._pointEditComponent.setCloseButtonClickHandler(this._replaceEditToPoint);
        this._pointEditComponent.setDeleteButtonClickHandler(() => {
          this._onDataChange(point, null);
        });

        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        if (openEditForm) {
          this._replacePointToEdit();
        }
        break;
      case Mode.ADDING:
        this._onViewChange();
        this._pointEditComponent.setDeleteButtonClickHandler(() => {
          this._onDataChange(EmptyPoint, null);
        });
        if (oldPointComponent && oldPointEditComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    this._pointEditComponent.removeElement();
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();

    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(EmptyPoint, null);
      } else {
        this._replaceEditToPoint();
      }
    }
  }
}
