const TOTAL_PRICE_ON_START = 0;

export const calcTotalPrice = (points) => {
  return []
  .concat(...points
    .slice()
    .map(
        (point) => [point.basePrice,
          ...point[`offers`].map((offer) => offer.price)]
    )
  )
  .reduce((sum, price) => {
    return sum + price;
  }, TOTAL_PRICE_ON_START);
};
