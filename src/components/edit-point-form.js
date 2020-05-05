import {EVENT_TYPES, TRANSFER_TYPES, ACTIVITY_TYPES} from "../const.js";
import {formatDate} from "../utils.js";

const createOffers = (offers) => {
  return offers.map((offer, index) => {
    const {title, price} = offer;
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  }).join(`\n`);
};

const createPhotos = (photos) => {
  return photos.map((photo) => {
    const {src, description} = photo;
    return `<img class="event__photo" src="${src}" alt="${description}">`;
  }).join(`\n`);
};

const createDataListOfDestinations = (destinations) => {
  return destinations.map((destination) => {
    return `
    <option value="${destination}"></option>`;
  }).join(`\n`);
};


const createEventTypeItem = (types, checkedType, id) => {
  return EVENT_TYPES
        .filter((type) => types.has(type))
        .map((type) => {
          return `
          <div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"
            ${type === checkedType ? `checked` : ``}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
          </div>`;
        })
        .join(`\n`);
};


const createEventTypeList = (checkedType, id) => {
  return `
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>
      ${createEventTypeItem(TRANSFER_TYPES, checkedType, id)}
    </fieldset>

    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>
      ${createEventTypeItem(ACTIVITY_TYPES, checkedType, id)}
    </fieldset>`;
};


export const createEditPointForm = (event, sortedDestinations) => {
  const {
    type,
    [`base-price`]: price,
    [`date-from`]: dateFrom,
    [`date-to`]: dateTo,
    destination,
    id,
    [`is-favorite`]: isFavorite,
    offers
  } = event;

  const {description, name, pictures} = destination;

  const offersList = offers[`offers`];
  const areOffers = offersList.length > 0;

  const isDescription = !!description;
  const arePictures = pictures.length > 0;

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

        <div class="event__type-list">
          ${createEventTypeList(type, id)}
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type} to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${createDataListOfDestinations(sortedDestinations)}
        </datalist>
      </div>


      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${formatDate(dateFrom)}">
        —
        <label class="visually-hidden" for="event-end-time-${id}">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${formatDate(dateTo)}">
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

    <section class="event__details">
      ${areOffers ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffers(offersList)}
        </div>
      </section>
      ` : ``}

      ${isDescription || arePictures ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${isDescription ? `<p class="event__destination-description">${description}</p>` : ``}

          ${arePictures ? `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPhotos(pictures)}
              </div>
            </div>
          ` : ``}
        </section>
      ` : ``}

    </section>
  </form>`
  ;
};
