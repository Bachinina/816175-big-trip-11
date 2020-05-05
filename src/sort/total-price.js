const TOTAL_PRICE_ON_START = 0;

export const calcTotalPrice = (points) => {
  return points.reduce((sum, point) => {
    return sum + point[`base-price`];
  }, TOTAL_PRICE_ON_START);
};
