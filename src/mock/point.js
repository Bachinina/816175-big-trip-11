import {EventType} from "../const.js";
import {generateOffers} from "./point-offers.js";
import {generateDate} from './point-date.js';
import {selectRandomArrElement, selectRandomNumber} from "../utils/common.js";


const DESTINATIONS = [`Madrid`, `Moscow`, `Helsinki`, `Paris`];

const SENTENCES = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, ` Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];


const MIN_NUMBER_OF_SENTENCES = 1;
const MAX_NUMBER_OF_SENTENCES = 5;

const MIN_NUMBER_OF_PHOTOS = 1;
const MAX_NUMBER_OF_PHOTOS = 4;

const MIN_PRICE = 50;
const MAX_PRICE = 1000;


const generateDescription = (min, max) => {
  const description = [];
  const descriptionLength = selectRandomNumber(min, max);

  for (let i = MIN_NUMBER_OF_SENTENCES; i <= descriptionLength; i++) {
    description.push(selectRandomArrElement(SENTENCES));
  }
  return description.join(`\n`);
};

export const generatePhotosArr = (length) => {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(
        {
          src: `http://picsum.photos/248/152?r=${Math.random()}`,
          description: generateDescription(0, 1)
        });
  }
  return array;
};


const generatePoint = (id) => {
  const type = selectRandomArrElement(EventType.ALL);
  const pointDate = generateDate();
  return {
    type,
    [`base-price`]: selectRandomNumber(MIN_PRICE, MAX_PRICE),
    [`date-from`]: pointDate[`date-from`],
    [`date-to`]: pointDate[`date-to`],
    [`destination`]: {
      [`description`]: generateDescription(MIN_NUMBER_OF_SENTENCES, MAX_NUMBER_OF_SENTENCES),
      [`name`]: selectRandomArrElement(DESTINATIONS),
      [`pictures`]: generatePhotosArr(selectRandomNumber(MIN_NUMBER_OF_PHOTOS, MAX_NUMBER_OF_PHOTOS))
    },
    id,
    [`is-favorite`]: Math.random() > 0.5,
    [`offers`]: generateOffers(type)
  };
};

export const generatePoints = (amount) => {
  const events = [];

  for (let i = 1; i <= amount; i++) {
    events.push(generatePoint(i));
  }
  return events;
};
