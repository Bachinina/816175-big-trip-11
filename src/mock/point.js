import {EventType} from "../const.js";
import {generateDate} from './point-date.js';
import {selectRandomArrElement, selectRandomNumber} from "../utils/common.js";

const MIN_PRICE = 50;
const MAX_PRICE = 1000;

let offers = [];
let destinations = [];

const selectRandomOffers = (offersList) => {
  const selectedOffers = [];
  offersList.forEach((offer) => {
    if (Math.random() > 0.5) {
      selectedOffers.push(offer);
    }
  });

  return selectedOffers;
};

const generatePoint = () => {
  const type = selectRandomArrElement(EventType.ALL);
  const pointDate = generateDate();
  return {
    type,
    [`base-price`]: selectRandomNumber(MIN_PRICE, MAX_PRICE),
    [`date-from`]: pointDate[`date-from`],
    [`date-to`]: pointDate[`date-to`],
    [`destination`]: selectRandomArrElement(destinations),
    id: String(new Date() + Math.random()),
    [`is-favorite`]: false,
    [`offers`]: selectRandomOffers([].concat(...offers.filter((offer) => offer.type === type).map((offer) => offer.offers)))
  };
};

export const generatePoints = (count, offersList, destinationsList) => {
  offers = offersList;
  destinations = destinationsList;

  const points = [];

  for (let i = 1; i <= count; i++) {
    points.push(generatePoint());
  }
  return points;
};
