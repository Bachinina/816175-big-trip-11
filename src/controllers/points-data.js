import {generatePoints} from '../mock/point.js';
import {generatePointOffers} from '../mock/point-offers.js';
import {generateDestinations} from '../mock/point-destinations.js';
import {getTripDates, getTripDestinations} from '../calculations/info.js';
import {sortPointsByTime} from '../calculations/points.js';
import {calcTotalPrice} from '../calculations/total-price.js';


export default class PointsDataController {
  constructor(count) {
    this._offers = generatePointOffers();
    this._destinations = generateDestinations();

    this._points = sortPointsByTime(
        generatePoints(count, this._offers, this._destinations)
    );

    this._datesOfTrip = ``;
    this._tripDestinations = ``;
    this._totalPrice = 0;

    if (this._points.length > 0) {
      this._datesOfTrip = getTripDates(this._points);
      this._tripDestinations = getTripDestinations(this._points);
      this._totalPrice = calcTotalPrice(this._points);
    }
  }

  getPoints() {
    return this._points;
  }

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
  getDestinations() {
    return this._destinations;
  }

  // Названия пунктов назначения в хронологическом порядке
  getTripDestinations() {
    return this._tripDestinations;
  }
}
