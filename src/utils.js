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
  const diffTimeInMillisec = Math.ceil(Math.abs(dateTo.getTime() - dateFrom.getTime()));
  const diffTime = converseMillisec(diffTimeInMillisec);

  const formatedTimeInterval = `
    ${diffTime.days > 0 ? standardizeFigures(diffTime.days) + `D` : ``}
    ${diffTime.hours > 0 ? standardizeFigures(diffTime.hours) + `H` : ``}
    ${diffTime.minutes > 0 ? standardizeFigures(diffTime.minutes) + `M` : ``}
  `;
  return formatedTimeInterval;

};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
