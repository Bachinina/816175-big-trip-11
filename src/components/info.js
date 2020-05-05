import {MONTHS} from "../const.js";

const formatDestInterval = (arr) => {
  if (arr.length > 3) {
    return `${arr[0] + ` &mdash; ... &mdash; ` + arr[arr.length - 1]}`;
  } else {
    return `${arr.map((el, index) => {
      return index !== arr.length - 1 ? `${el + ` &mdash; `}` : el;
    }).join(`\n`)}`;
  }
};

export const createInfo = (destinations, dates) => {
  const {start, finish} = dates;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${formatDestInterval(destinations)}</h1>

      <p class="trip-info__dates">
      ${MONTHS[start.getMonth()] === MONTHS[finish.getMonth()]
    ? `${MONTHS[start.getMonth()]} ${start.getDate()}&nbsp;&mdash;&nbsp; ${finish.getDate()}`
    : `${MONTHS[start.getMonth()]} ${start.getDate()}&nbsp;&mdash;&nbsp; ${MONTHS[finish.getMonth()]} ${finish.getDate()}`}
      </p>
    </div>
  </section>`;
};
