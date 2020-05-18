import PointAddBtnComponent, {ButtonMode} from '../components/point-add-btn.js';

import {render, replace, RenderPosition} from "../utils/render.js";


export default class PointAddBtnController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;

    this._container = container;
    this._pointAddBtnComponent = null;

    this._activeButtonMode = ButtonMode.DEFAULT;

    this._onButtonSetDefaultMode = this._onButtonSetDefaultMode.bind(this);
    this._onButtonModeChange = this._onButtonModeChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onButtonSetDefaultMode);
    this._pointsModel.setDeletePointCreateHandler(this._onButtonSetDefaultMode);
  }

  render() {
    const oldPointAddBtnComponent = this._pointAddBtnComponent;

    this._pointAddBtnComponent = new PointAddBtnComponent(this._activeButtonMode);
    this._pointAddBtnComponent.setPointAddBtnHandler(this._onButtonModeChange);

    if (oldPointAddBtnComponent) {
      replace(this._pointAddBtnComponent, oldPointAddBtnComponent);
    } else {
      render(this._container, this._pointAddBtnComponent, RenderPosition.BEFOREEND);
    }
  }

  setActiveMode(activeMode) {
    this._activeButtonMode = activeMode;
    this.render();
  }

  _onButtonModeChange(activeMode) {
    this.setActiveMode(activeMode);
    if (this._activeButtonMode === ButtonMode.ADDING) {
      this._pointsModel.createPoint();
    }
  }

  _onButtonSetDefaultMode() {
    this.setActiveMode(ButtonMode.DEFAULT);
  }
}
