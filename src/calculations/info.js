export const getTripDestinations = (points) => {
  return points
  .slice()
  .map((point) => point.destination.name)
  .filter(function (name, index, arr) {
    return arr[index - 1] !== name;
  });
};


export const getTripDates = (points) => {
  return {
    start: points[0][`date-from`],
    finish: points[points.length - 1][`date-to`]
  };
};
