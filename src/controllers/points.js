import {generatePoints} from '../mock/point.js';
import {getTripDates, getTripDestinations} from '../calculations/info.js';
import {sortPointsByDate} from '../calculations/common.js';
import {calcTotalPrice} from '../calculations/total-price.js';


export default class PointsController {
  constructor(count) {
    this._points = sortPointsByDate(generatePoints(count));

    this._datesOfTrip = ``;
    this._destinations = ``;
    this._totalPrice = 0;

    if (this._points.length > 0) {
      this._datesOfTrip = getTripDates(this._points);
      this._destinations = getTripDestinations(this._points);
      this._totalPrice = calcTotalPrice(this._points);
    }
  }

  getPoints() {
    return this._points;
  }

  getDatesOfTrip() {
    return this._datesOfTrip;
  }

  getDestinations() {
    return this._destinations;
  }

  getTotalPrice() {
    return this._totalPrice;
  }
}
