const groupSortedPoints = (sortedPoints) => {
  const arr = [];

  sortedPoints.forEach((point) => {
    const pointDate = point[`date-from`];
    const indexOfElem = arr.findIndex((item) => {
      return item.date.getDate() === pointDate.getDate() && item.date.getMonth() === pointDate.getMonth();
    });

    if (indexOfElem !== -1) {
      arr[indexOfElem].events.push(point);
    } else {
      arr.push(
          {
            date: pointDate,
            events: [point]
          }
      );
    }
  });

  return arr;
};

const sortPointsByTime = (points) => {
  const sortedPoints = points
    .sort((a, b) => {
      return a[`date-from`].getHours() - b[`date-from`].getHours();
    })
    .sort((a, b) => {
      return a[`date-from`].getDate() - b[`date-from`].getDate();
    })
    .sort((a, b) => {
      return a[`date-from`].getMonth() - b[`date-from`].getMonth();
    });
  return sortedPoints;
};


export const sortPoints = (points) => {
  return groupSortedPoints(sortPointsByTime(points));
};


export const selectDestinations = (points) => {
  const sortedDestinations = [];

  sortPointsByTime(points.slice()).forEach((point) => {
    const name = point.destination.name;

    if (sortedDestinations.indexOf(name) < 0) {
      sortedDestinations.push(name);
    }
  });

  return sortedDestinations;
};


export const getTripDates = (sortedPoints) => {
  return {
    start: sortedPoints[0].date,
    finish: sortedPoints[sortedPoints.length - 1].date
  };
};
