const standardizeFigures = (figure) => {
  return figure >= 10 ? figure : `0${figure}`;
};

const converseMillisec = (millisec) => {
  const days = Math.floor((millisec / (1000 * 60 * 60 * 24)));

  const hours = Math.floor((millisec / (1000 * 60 * 60)) % 24);

  const minutes = Math.floor((millisec / (1000 * 60)) % 60);

  return {
    days,
    hours,
    minutes
  };
};

export const selectRandomArrElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const selectRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getDiffTimeInMillisec = (dateFrom, dateTo) => {
  return Math.ceil(Math.abs(dateTo.getTime() - dateFrom.getTime()));
};

export const formatTime = (date) => {
  const hours = standardizeFigures(date.getHours());
  const minutes = standardizeFigures(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const year = date.getFullYear().toString().substr(-2, 2);
  const month = standardizeFigures(date.getMonth());
  const day = standardizeFigures(date.getDate());

  return `${day}/${month}/${year} ${formatTime(date)}`;
};

export const formatTimeInterval = (dateFrom, dateTo) => {
  const diffTimeInMillisec = getDiffTimeInMillisec(dateFrom, dateTo);
  const diffTime = converseMillisec(diffTimeInMillisec);

  const formatedTimeInterval = `
    ${diffTime.days > 0 ? standardizeFigures(diffTime.days) + `D` : ``}
    ${diffTime.hours > 0 ? standardizeFigures(diffTime.hours) + `H` : ``}
    ${diffTime.minutes > 0 ? standardizeFigures(diffTime.minutes) + `M` : ``}
  `;
  return formatedTimeInterval;
};
