export const groupPointsByDate = (sortedPoints) => {
  const arr = [];

  sortedPoints.slice().forEach((point) => {
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

export const sortPointsByDate = (points) => {
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
