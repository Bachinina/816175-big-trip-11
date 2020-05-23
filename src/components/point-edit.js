import AbstractSmartComponent from "./abstract-smart-component.js";
import {Mode as PointControllerMode} from '../controllers/point.js';
import {EventType} from "../const.js";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};


const createOffersTemplate = (selectedOffers, allOffers) => {
  return allOffers.map((offer, index) => {
    const {title, price} = offer;
    return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index + 1}" type="checkbox" name="event-offer" value="${title}"
        ${selectedOffers.map((el) => el.title).indexOf(title) !== -1 ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${index + 1}">
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

const createPointEditTemplate = (mode, point, allDestinationsNames, allOffers, params = {}, options = {}) => {

  const {
    id,
    isFavorite,
  } = point;

  const {type, destination, offers, [`basePrice`]: price} = params;
  const {isDescription, isPicturesSetExisted, isOffersSetExisted, isFirstPoint = false, externalData} = options;
  const {description, name, pictures} = destination;
  const offersOfCurrentType = [].concat(...allOffers.filter((offer) => offer.type === type).map((offer) => offer.offers));

  const pointTitle = `${type} ${EventType.TRANSFER.has(type) ? `to ` : `in `}`;

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return `<li class="trip-events__item">
  <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <input type="hidden" name="id" value="${id}">
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

          <input class="event__input  event__input--destination" id="event-destination-${id}" type="" name="event-destination" value="${name}" list="destination-list-${id}" required autocomplete="off">
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
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}" required  autocomplete="off" step="1" min="0">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${mode === PointControllerMode.ADDING ? `Cancel` : `${deleteButtonText}`}</button>

        ${mode === PointControllerMode.ADDING ? `` : `
          <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
            ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>
        `}

        ${mode === PointControllerMode.ADDING ? `` : `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        `}
      </header>

      ${isFirstPoint ? `` : `
        ${isDescription || isPicturesSetExisted || isOffersSetExisted ? `
          <section class="event__details">
            ${isOffersSetExisted ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${createOffersTemplate(offers, offersOfCurrentType)}
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
      `}
    </form>
  </li>`;
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, pointsModel, mode) {
    super();
    this._originalPoint = Object.assign({}, point);
    this._point = point;
    this._pointsModel = pointsModel;
    this._mode = mode;

    // Все возможные пункты назначения с описанием и фото
    this._allDestinations = this._pointsModel.getAllDestinations();
    // Названия пунктов назначения
    this._allDestinationNames = (this._allDestinations).map((dest) => dest.name);

    // Все возможные предложения по типу точки маршрута
    this._allOffers = this._pointsModel.getAllOffers();


    this._type = point.type;
    this._offers = point.offers;
    this._destination = point.destination;
    this._dateFrom = point.dateFrom;
    this._dateTo = point.dateTo;
    this._basePrice = point.basePrice;
    this._externalData = DefaultData;


    this._formSubmitHandler = null;
    this._closeButtonClickHandler = null;
    this._favoritesButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
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

  getData() {
    const form = this.getElement().querySelector(`form`);
    const formData = new FormData(form);
    this._basePrice = this._mode === PointControllerMode.DEFAULT ? this._basePrice : parseInt(formData.get(`event-price`), 10);

    return formData;
  }

  getTemplate() {
    return createPointEditTemplate(this._mode, this._point, this._allDestinationNames, this._allOffers,
        // Params
        {
          type: this._type,
          offers: this._offers,
          destination: this._destination,
          basePrice: this._basePrice,
        },
        // Options
        {
          isDescription: !!this._destination.description,
          isPicturesSetExisted: this._destination.pictures.length > 0,
          isOffersSetExisted: [].concat(...this._allOffers.filter((offer) => offer.type === this._type).map((offer) => offer.offers)).length > 0,
          isFirstPoint: this._mode === PointControllerMode.ADDING && this._pointsModel.getPoints().length === 0,
          externalData: this._externalData
        }
    );
  }

  getAllElements() {
    const inputs = this.getElement().querySelectorAll(`input`);
    const buttons = this.getElement().querySelectorAll(`button`);
    return [].concat([...inputs], [...buttons]);
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._originalPoint;
    this._type = point.type;
    this._offers = point.offers;
    this._destination = point.destination;

    this.rerender();
  }

  removeElement() {
    this._delFlatpickr();
    super.removeElement();
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoritesButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setFormSubmitHandler(cb) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, cb);
    this._formSubmitHandler = cb;
  }

  setCloseButtonClickHandler(cb) {
    if (this._mode === PointControllerMode.DEFAULT) {
      this.getElement().querySelector(`form`).querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
      this._closeButtonClickHandler = cb;
    }
  }

  setFavoriteButtonClickHandler(cb) {
    if (this._mode === PointControllerMode.DEFAULT) {
      this.getElement().querySelector(`form`).querySelector(`.event__favorite-btn`).addEventListener(`click`, cb);
      this._favoritesButtonClickHandler = cb;
    }
  }

  setDeleteButtonClickHandler(cb) {
    this.getElement().querySelector(`form`).querySelector(`.event__reset-btn`).addEventListener(`click`, cb);
    this._deleteButtonClickHandler = cb;
  }


  _subscribeOnEvents() {
    const element = this.getElement().querySelector(`form`);

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this._offers = [];

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

    const destinationInput = element.querySelector(`[name="event-destination"]`);
    const checkName = (value) => {
      return this._allDestinationNames.indexOf(value) > 0;
    };
    destinationInput.addEventListener(`input`, () => {
      const value = destinationInput.value;
      if (!checkName(value)) {
        destinationInput.setCustomValidity(`Please select a value from the list`);
      } else if (destinationInput.validity.valueMissing) {
        destinationInput.setCustomValidity(`Please select a value from the list`);
      } else {
        destinationInput.setCustomValidity(``);
      }
    });
  }

  _applyFlatpickr() {
    this._delFlatpickr();

    const dateFrom = this.getElement().querySelector(`form`).querySelector(`[name='event-start-time']`);
    const dateTo = this.getElement().querySelector(`form`).querySelector(`[name='event-end-time']`);

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

  _delFlatpickr() {
    if (this._flatpickrFrom && this._flatpickrTo) {
      this._flatpickrFrom.destroy();
      this._flatpickrTo.destroy();
      this._flatpickrFrom = null;
      this._flatpickrTo = null;
    }
  }
}

