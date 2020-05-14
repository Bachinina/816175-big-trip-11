import AbstractSmartComponent from "./abstract-smart-component.js";
import {EventType} from "../const.js";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


const createOffersTemplate = (offers) => {
  return offers.map((offer, index) => {
    const {title, price} = offer;
    return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  }).join(`\n`);
};

const createPhotosTemplate = (photos) => {
  return photos.map((photo) => {
    const {src, description} = photo;
    return `<img class="event__photo" src="${src}" alt="${description}">`;
  }).join(`\n`);
};

const createDataListOfDestinationsTemplate = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination}"></option>`;
  }).join(`\n`);
};

const createEventTypeItemTemplate = (types, checkedType, id) => {
  return EventType.ALL
        .filter((type) => types.has(type))
        .map((type) => {
          return `<div class="event__type-item">
              <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
              ${type === checkedType ? `checked` : ``}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
            </div>`;
        })
        .join(`\n`);
};

const createEventTypeListTemplate = (checkedType, id) => {
  return `<fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>
      ${createEventTypeItemTemplate(EventType.TRANSFER, checkedType, id)}
    </fieldset>

    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>
      ${createEventTypeItemTemplate(EventType.ACTIVITY, checkedType, id)}
    </fieldset>`;
};

const createPointEditTemplate = (point, allDestinationsNames, params = {}, options = {}) => {

  const {
    [`base-price`]: price,
    id,
    [`is-favorite`]: isFavorite,
  } = point;

  const {type, destination, offers} = params;
  const {isDescription, isPicturesSetExisted, isOffersSetExisted} = options;
  const {description, name, pictures} = destination;

  const pointTitle = `${type} ${EventType.TRANSFER.has(type) ? `to ` : `in `}`;


  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            ${createEventTypeListTemplate(type, id)}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">${pointTitle}</label>

          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createDataListOfDestinationsTemplate(allDestinationsNames)}
          </datalist>
        </div>


        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" placeholder="Click to choose">
          —
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" placeholder="Click to choose">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
          ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${id}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      ${isDescription || isPicturesSetExisted || isOffersSetExisted ? `
        <section class="event__details">
          ${isOffersSetExisted ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersTemplate(offers)}
            </div>
          </section>
          ` : ``}

          ${isDescription || isPicturesSetExisted ? `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              ${isDescription ? `<p class="event__destination-description">${description}</p>` : ``}

              ${isPicturesSetExisted ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${createPhotosTemplate(pictures)}
                  </div>
                </div>
              ` : ``}
            </section>
          ` : ``}
        </section>
      ` : ``}
    </form>`;
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, allDestinations, allOffers) {
    super();
    this._point = point;

    // Все возможные пункты назначения с описанием и фото
    this._allDestinations = allDestinations;
    // Названия пунктов назначения
    this._allDestinationNames = (this._allDestinations).map((dest) => dest.name);
    this._allOffers = allOffers;


    this._type = point.type;
    this._offers = point.offers;
    this._destination = point.destination;
    this._dateFrom = point[`date-from`];
    this._dateTo = point[`date-to`];


    this._formSubmitHandler = null;
    this._closeButtonClickHandler = null;
    this._favoritesButtonClickHandler = null;
    this._subscribeOnEvents();

    // Дата и время
    this._flatpickrFrom = null;
    this._flatpickrTo = null;
    this._flatpickrOptions = {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      enableTime: true,
      time_24hr: true // eslint-disable-line
    };
    this._applyFlatpickr();
  }

  getTemplate() {
    return createPointEditTemplate(this._point, this._allDestinationNames,
        // Params
        {
          type: this._type,
          offers: this._offers,
          destination: this._destination,
        },
        // Options
        {
          isDescription: !!this._destination.description,
          isPicturesSetExisted: this._destination.pictures.length > 0,
          isOffersSetExisted: this._offers.length > 0
        }
    );
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;

    this._type = point.type;
    this._offers = point.offers;
    this._destination = point.destination;
    this.rerender();
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._favoritesButtonClickHandler);

    this._subscribeOnEvents();
  }

  setFormSubmitHandler(cb) {
    this.getElement().addEventListener(`submit`, cb);
    this._formSubmitHandler = cb;
  }

  setCloseButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
    this._closeButtonClickHandler = cb;
  }

  setFavoritesButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, cb);
    this._favoritesButtonClickHandler = cb;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this._offers = [].concat(...this._allOffers.filter((el) => el.type === this._type).map((el) => el.offers));

      this.rerender();
    });

    element.querySelector(`[name='event-destination']`).addEventListener(`change`, (evt) => {
      const name = evt.target.value;
      const currentDestination = this._allDestinations.filter((el) => el.name === name);

      if (currentDestination.length > 0) {
        this._destination = currentDestination[0];
        this.rerender();
      }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrFrom || this._flatpickrTo) {
      this._flatpickrFrom.destroy();
      this._flatpickrTo.destroy();
      this._flatpickrFrom = null;
      this._flatpickrTo = null;
    }

    const dateFrom = this.getElement().querySelector(`[name='event-start-time']`);
    const dateTo = this.getElement().querySelector(`[name='event-end-time']`);

    const to = flatpickr(dateTo,
        Object.assign({}, this._flatpickrOptions, {minDate: this._dateFrom})
    );
    to.setDate(this._dateTo);

    const from = flatpickr(dateFrom,
        Object.assign({},
            this._flatpickrOptions,
            {defaultDate: this._dateFrom || `today`},
            {onChange(selectedDates) {
              to.set(`minDate`, selectedDates[0]);

              if (to.selectedDates[0] === undefined) {
                const toDate = new Date(selectedDates[0].getTime());
                toDate.setHours(selectedDates[0].getHours() + 1);

                to.setDate(toDate);
              }
            }}
        )
    );

    this._flatpickrFrom = from;
    this._flatpickrTo = to;
  }
}

