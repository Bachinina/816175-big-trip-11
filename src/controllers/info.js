import InfoComponent from '../components/info.js';


import {render, replace, RenderPosition} from "../utils/render.js";


export default class InfoController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._infoComponent = null;

    this._tripDestinations = this._pointsModel.getTripDestinations();
    this._datesOfTrip = this._pointsModel.getDatesOfTrip();
    this._totalPrice = this._pointsModel.getTotalPrice();

    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.setDataChangeHandler(this._onDataChange);
    this._pointsModel.setDataLoadHandler(this._onDataChange);
  }

  render() {
    const oldInfoComponent = this._infoComponent;

    this._infoComponent = new InfoComponent(this._tripDestinations, this._datesOfTrip, this._totalPrice);

    if (oldInfoComponent) {
      replace(this._infoComponent, oldInfoComponent);
    } else {
      render(this._container, this._infoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this._tripDestinations = this._pointsModel.getTripDestinations();
    this._datesOfTrip = this._pointsModel.getDatesOfTrip();
    this._totalPrice = this._pointsModel.getTotalPrice();

    this.render();
  }
}
