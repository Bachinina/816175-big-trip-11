import FilterComponent from './components/filter.js';
import InfoComponent from './components/info.js';
import MenuComponent from './components/menu.js';
import TotalPriceComponent from './components/total-price.js';
import PointsDataController from './controllers/points-data.js';
import TripController from './controllers/trip.js';

import {render, RenderPosition} from "./utils/render.js";


const COUNT_OF_POINTS = 20;

// Генерация событий (моки)
// ------------------------------------------------
const points = new PointsDataController(COUNT_OF_POINTS);
// ------------------------------------------------


// Шапка: информация, меню, фильтр
const headerMainBlock = document.querySelector(`.trip-main`);
render(headerMainBlock, new InfoComponent(points.getTripDestinations(), points.getDatesOfTrip()), RenderPosition.AFTERBEGIN);

const tripMainInfo = headerMainBlock.querySelector(`.trip-info`);
render(tripMainInfo, new TotalPriceComponent(points.getTotalPrice()), RenderPosition.BEFOREEND);

const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);
render(menuBlock, new MenuComponent(), RenderPosition.AFTEREND);
render(filterBlock, new FilterComponent(), RenderPosition.AFTEREND);


// Контент: сортировка, события, редактирование
const pointsListBlock = document.querySelector(`.trip-events`);

new TripController(pointsListBlock, points.getDestinations(), points.getAllOffers())
  .render(points.getPoints());
