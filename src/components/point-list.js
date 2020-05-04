import {MONTHS, TRANSFER_TYPES} from "../const.js";
import {formatTime, formatTimeInterval} from "../utils.js";


const createOffer = (offer) => {
  const {price, title} = offer;

  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>`;
};

const createPointEvent = (event) => {
  const {
    type,
    [`base-price`]: price,
    [`date-from`]: dateFrom,
    [`date-to`]: dateTo,
    destination,
    [`offers`]: offers
  } = event;

  const {[`name`]: name} = destination;

  const offersList = offers[`offers`];
  const areOffers = offersList.length > 0;


  return `<li class="trip-events__item">
  <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">
        ${type}
        ${TRANSFER_TYPES.has(type) ? `to ` : `in `}
        ${name}
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
            ${offersList.slice(0, 3).map((offer) => createOffer(offer)).join(`\n`)}
          </ul>` : ``}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};


const createPointDay = (point, index) => {
  const {date, events} = point;

  return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="2019-03-18">${MONTHS[date.getMonth()]} ${date.getDate()}</time>
    </div>

    <ul class="trip-events__list">
      ${events.map((event) => createPointEvent(event)).join(`\n`)}
    </ul>
  </li>`;
};


export const createPointList = (points) =>
  `<ul class="trip-days">
    ${points.map((point, index) => createPointDay(point, index)).join(`\n`)}
  </ul>`
  ;
