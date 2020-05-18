import moment from "moment";

const standardizeFigures = (figure) => {
  return figure >= 10 ? figure : `0${figure}`;
};

export const getDiffTime = (dateFrom, dateTo) => {
  const from = moment(dateFrom);
  const to = moment(dateTo);
  return moment.duration(to.diff(from));
};

export const selectRandomArrElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const selectRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatTimeInterval = (dateFrom, dateTo) => {
  const diffTime = getDiffTime(dateFrom, dateTo);

  const days = diffTime.days();
  const hours = diffTime.hours();
  const minutes = diffTime.minutes();

  const formatedTimeInterval = `
    ${days > 0 ? standardizeFigures(days) + `D` : ``}
    ${hours > 0 ? standardizeFigures(hours) + `H` : ``}
    ${minutes > 0 ? standardizeFigures(minutes) + `M` : ``}
  `;
  return formatedTimeInterval;
};
