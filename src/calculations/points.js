export const sortPointsByTime = (points) => {
  const sortedPoints = points
    .sort((a, b) => {
      return a.dateFrom.getHours() - b.dateFrom.getHours();
    })
    .sort((a, b) => {
      return a.dateFrom.getDate() - b.dateFrom.getDate();
    })
    .sort((a, b) => {
      return a.dateFrom.getMonth() - b.dateFrom.getMonth();
    });
  return sortedPoints;
};

export const sortPointsByDate = (points) => {
  const arr = [];

  sortPointsByTime(points.slice()).forEach((point) => {
    const pointDate = point.dateFrom;
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
