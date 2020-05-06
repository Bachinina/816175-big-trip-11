import {EventType} from "../const.js";
import {createElement, formatTime, formatTimeInterval} from "../utils.js";

const MAX_OFFERS_TO_SHOW = 3;


const createOfferTemplate = (offer) => {
  const {price, title} = offer;

  return `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`;
};

const createPointTemplate = (point) => {
  const {
    type,
    [`base-price`]: price,
    [`date-from`]: dateFrom,
    [`date-to`]: dateTo,
    destination,
    [`offers`]: offers
  } = point;

  const {[`name`]: name} = destination;

  const offersList = offers[`offers`];
  const areOffers = offersList.length > 0;

  const pointTitle = `
    ${type}
    ${EventType.TRANSFER.has(type) ? `to ` : `in `}
    ${name}
    `;


  return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">
          ${pointTitle}
        </h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${formatTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${formatTime(dateTo)}</time>
          </p>
          <p class="event__duration">${formatTimeInterval(dateFrom, dateTo)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        ${areOffers ? `<h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
              ${offersList.slice(0, MAX_OFFERS_TO_SHOW).map((offer) => createOfferTemplate(offer)).join(`\n`)}
            </ul>` : ``}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class Point {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
