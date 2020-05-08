const TOTAL_PRICE_ON_START = 0;

export const calcTotalPrice = (points) => {
  return points
  .slice()
  .map((point) => point[`base-price`])
  .reduce((sum, price) => {
    return sum + price;
  }, TOTAL_PRICE_ON_START);
};
