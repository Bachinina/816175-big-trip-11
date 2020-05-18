import {FilterType} from "../const.js";

const getFuturePoints = (points, nowDate) => {
  return points.filter((point) => {
    return point[`date-from`] > nowDate;
  });
};

const getPastPoints = (points, nowDate) => {
  return points.filter((point) => {
    return point[`date-to`] < nowDate;
  });
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERY:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }
  return points;
};
