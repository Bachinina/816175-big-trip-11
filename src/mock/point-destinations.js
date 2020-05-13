import {DESTINATIONS} from "../const.js";
import {selectRandomArrElement, selectRandomNumber} from "../utils/common.js";


const SENTENCES = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, ` Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];

const MIN_NUMBER_OF_SENTENCES = 0;
const MAX_NUMBER_OF_SENTENCES = 5;


const MIN_NUMBER_OF_PHOTOS = 1;
const MAX_NUMBER_OF_PHOTOS = 4;


const generateDescription = (min, max) => {
  const description = [];
  const descriptionLength = selectRandomNumber(min, max);

  for (let i = min; i < descriptionLength; i++) {
    description.push(selectRandomArrElement(SENTENCES));
  }
  return description.join(`\n`);
};

const generatePhotosArr = (length) => {
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

export const generateDestinations = () => {
  return DESTINATIONS.map((destination) => {
    return {
      "description": generateDescription(MIN_NUMBER_OF_SENTENCES, MAX_NUMBER_OF_SENTENCES),
      "name": destination,
      "pictures": generatePhotosArr(selectRandomNumber(MIN_NUMBER_OF_PHOTOS, MAX_NUMBER_OF_PHOTOS))
    };
  });
};

