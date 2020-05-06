import FilterComponent from './components/filter.js';
import InfoComponent from './components/info.js';
import MenuComponent from './components/menu.js';
import NoPointsComponent from './components/no-points.js';
import PointComponent from './components/point.js';
import PointDayComponent from './components/point-day.js';
import PointEditComponent from './components/point-edit.js';
import PointListComponent from './components/point-list.js';
import SortComponent from './components/sort.js';
import TotalPriceComponent from './components/total-price.js';

import {generatePoints} from './mock/point.js';
import {getTripDates, sortPoints, selectDestinations} from './sort/start-sort.js';
import {calcTotalPrice} from './sort/total-price.js';
import {render, RenderPosition} from "./utils.js";


const COUNT_OF_POINTS = 1;
// ------------------------------------------------
// Генерация событий (моки)
const points = generatePoints(COUNT_OF_POINTS);
const arePoints = points.length > 0;

// Сортировка и группировка событий по дням
const sortedPoints = arePoints > 0 ? sortPoints(points.slice()) : ``;
// Вычисление дат начала и окончания путешествия
const datesOfTrip = arePoints > 0 ? getTripDates(sortedPoints) : ``;
// Вычисление всех мест маршрута
const destinations = arePoints > 0 ? selectDestinations(points.slice()) : ``;
// Вычиление общей стоимости путешествия
const totalPrice = arePoints > 0 ? calcTotalPrice(points.slice()) : 0;
// ------------------------------------------------


// Шапка: информация, меню, фильтр
const headerMainBlock = document.querySelector(`.trip-main`);
render(headerMainBlock, new InfoComponent(destinations, datesOfTrip).getElement(), RenderPosition.AFTERBEGIN);

// ------------------------------------------------
const tripMainInfo = headerMainBlock.querySelector(`.trip-info`);
render(tripMainInfo, new TotalPriceComponent(totalPrice).getElement(), RenderPosition.BEFOREEND);

// ------------------------------------------------
const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);
render(menuBlock, new MenuComponent().getElement(), RenderPosition.AFTEREND);
render(filterBlock, new FilterComponent().getElement(), RenderPosition.AFTEREND);
// ------------------------------------------------


// Контент: сортировка, события, редактирование
const pointsListBlock = document.querySelector(`.trip-events`);

const renderPoint = (container, ...params) => {
  const [point, index] = params;

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToPoint();
    }
  };

  const replacePointToEdit = () => {
    container.replaceChild(pointEditElement.getElement(), pointElement.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceEditToPoint = () => {
    container.replaceChild(pointElement.getElement(), pointEditElement.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const pointElement = new PointComponent(point, index);
  const editButton = pointElement.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, replacePointToEdit);

  const pointEditElement = new PointEditComponent(point, destinations);
  const closeButton = pointEditElement.getElement().querySelector(`.event__rollup-btn`);
  closeButton.addEventListener(`click`, replaceEditToPoint);
  pointEditElement.getElement().addEventListener(`submit`, replaceEditToPoint);


  render(container, pointElement.getElement(), RenderPosition.BEFOREEND);
};

const renderPointDay = (container, ...params) => {
  const [pointDay, index] = params;
  const {date, [`events`]: pointDayList} = pointDay;

  const pointDayElement = new PointDayComponent(date, index);
  const pointDayListBlock = pointDayElement.getElement().querySelector(`.trip-events__list`);

  pointDayList.forEach((point) => {
    renderPoint(pointDayListBlock, point);
  });

  render(container, pointDayElement.getElement(), RenderPosition.BEFOREEND);
};

if (arePoints) {
  render(pointsListBlock, new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(pointsListBlock, new PointListComponent().getElement(), RenderPosition.BEFOREEND);

  const pointList = pointsListBlock.querySelector(`.trip-days`);
  sortedPoints.forEach((pointDay, index) => {
    renderPointDay(pointList, pointDay, index);
  });
} else {
  render(pointsListBlock, new NoPointsComponent().getElement(), RenderPosition.BEFOREEND);
}
