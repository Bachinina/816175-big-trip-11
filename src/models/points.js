import {getTripDates, getTripDestinations} from '../calculations/info.js';
import {getPointsByFilter} from "../utils/filter.js";
import {sortPointsByTime} from '../calculations/points.js';
import {calcTotalPrice} from '../calculations/total-price.js';
import {FilterType} from "../const.js";


export default class Points {
  constructor() {
    this._points = [];
    this._datesOfTrip = null;
    this._tripDestinations = null;
    this._totalPrice = 0;

    this._offers = [];
    this._destinations = [];
    this._activeFilterType = FilterType.EVERY;

    this._dataLoadHandlers = [];
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._pointCreateHandlers = [];
    this._deletePointCreateHandlers = [];
  }

  // Вспомогательные функции
  // ------------------------------------------------
  getPoints() {
    return this._points;
  }

  getFilter() {
    return this._activeFilterType;
  }

  getFiltredPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  calcInfo() {
    if (this._points.length > 0) {
      this._datesOfTrip = getTripDates(this._points);
      this._tripDestinations = getTripDestinations(this._points);
      this._totalPrice = calcTotalPrice(this._points);
    } else {
      this._datesOfTrip = null;
      this._tripDestinations = null;
      this._totalPrice = 0;
    }
  }

  setPoints(points) {
    this._points = sortPointsByTime(points);
    this.calcInfo();
    this._callHandlers(this._dataChangeHandlers);
  }

  setLoadedPoints(points) {
    this._points = sortPointsByTime(points);
    this.calcInfo();
    this._callHandlers(this._dataLoadHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  createPoint() {
    this._callHandlers(this._pointCreateHandlers);
  }

  deleteCreatedPoint() {
    this._callHandlers(this._deletePointCreateHandlers);
  }

  setDataChangeHandler(cb) {
    this._dataChangeHandlers.push(cb);
  }

  setDataLoadHandler(cb) {
    this._dataLoadHandlers.push(cb);
  }

  setFilterChangeHandler(cb) {
    this._filterChangeHandlers.push(cb);
  }


  setPointCreateHandler(cb) {
    this._pointCreateHandlers.push(cb);
  }

  setDeletePointCreateHandler(cb) {
    this._deletePointCreateHandlers.push(cb);
  }

  addPoint(point) {
    this.setPoints([].concat(point, this._points));
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }
    this.setPoints([].concat(this._points.slice(0, index), point, this._points.slice(index + 1)));
    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }
    this.setPoints([].concat(this._points.slice(0, index), this._points.slice(index + 1)));
    return true;
  }

  _callHandlers(cbs) {
    cbs.forEach((cb) => cb());
  }
  // ------------------------------------------------


  // Получение деталей путешествия
  // ------------------------------------------------
  getDatesOfTrip() {
    return this._datesOfTrip;
  }

  getTotalPrice() {
    return this._totalPrice;
  }

  getAllOffers() {
    return this._offers;
  }

  // Все пункты назначения с описанием и фото
  getAllDestinations() {
    return this._destinations;
  }

  // Названия пунктов назначения в хронологическом порядке
  getTripDestinations() {
    return this._tripDestinations;
  }
  // ------------------------------------------------
}
