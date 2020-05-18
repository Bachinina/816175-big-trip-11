import {selectRandomNumber} from "../utils/common.js";

const MIN_DATE = 14;
const MAX_DATE = 19;

const MIN_HOUR = 0;
const MAX_HOUR = 23;

const MIN_MINUTES = 0;
const MAX_MINUTES = 59;

const MONTH = 5;
const YEAR = 2020;

const generatePointDateFrom = () => {
  const dateFrom = new Date();

  dateFrom.setYear(YEAR);
  dateFrom.setMonth(MONTH - 1);
  dateFrom.setDate(selectRandomNumber(MIN_DATE, MAX_DATE));

  dateFrom.setHours(selectRandomNumber(MIN_HOUR, MAX_HOUR));
  dateFrom.setMinutes(selectRandomNumber(MIN_MINUTES, MAX_MINUTES));
  dateFrom.setSeconds(0);

  return dateFrom;
};

const generatePointDateTo = (dateFrom) => {
  const dateTo = new Date();
  // Год
  dateTo.setYear(dateFrom.getFullYear());
  // Месяц
  dateTo.setMonth(dateFrom.getMonth());
  // Дата
  dateTo.setDate(selectRandomNumber(
      dateFrom.getDate(),
      dateFrom.getDate() + selectRandomNumber(0, 3)
  ));

  // Часы
  dateTo.setHours(selectRandomNumber(
      dateFrom.getDate() === dateTo.getDate()
        ? dateFrom.getHours()
        : MIN_HOUR, MAX_HOUR)
  );

  // Минуты
  dateTo.setMinutes(
      selectRandomNumber(
          dateFrom.getDate() === dateTo.getDate() && dateFrom.getHours() === dateTo.getHours()
            ? dateFrom.getMinutes()
            : MIN_MINUTES, MAX_MINUTES
      )
  );
  dateTo.setSeconds(0);

  return dateTo;
};

export const generateDate = () => {
  const pointDateFrom = generatePointDateFrom();
  const pointDateTo = generatePointDateTo(pointDateFrom);

  return {
    [`date-from`]: pointDateFrom,
    [`date-to`]: pointDateTo,
  };
};
