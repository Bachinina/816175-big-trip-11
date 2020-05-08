import {selectRandomArrElement, selectRandomNumber} from "../utils/common.js";

const MIN_OFFER_NUMBER = 0;
const MAX_OFFER_NUMBER = 5;

const MIN_PRICE = 10;
const MAX_PRICE = 500;
const OFFER_TITLES = [`add luggage`, `switch to comfort class`, `add meal`, `choose seats`, `travel by train`];

const generateOffer = () => {
  return {
    title: selectRandomArrElement(OFFER_TITLES),
    price: selectRandomNumber(MIN_PRICE, MAX_PRICE)
  };
};

export const generateOffers = (type) => {
  const offersList = {
    type,
    offers: []
  };
  const offersNumber = selectRandomNumber(MIN_OFFER_NUMBER, MAX_OFFER_NUMBER);

  for (let i = 0; i < offersNumber; i++) {
    offersList.offers.push(generateOffer(type));
  }
  return offersList;
};
