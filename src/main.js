import FilterComponent from './components/filter.js';
import InfoComponent from './components/info.js';
import MenuComponent from './components/menu.js';
import TotalPriceComponent from './components/total-price.js';
import PointsController from './controllers/points.js';
import TripController from './controllers/trip.js';

import {render, RenderPosition} from "./utils/render.js";


const COUNT_OF_POINTS = 10;
// ------------------------------------------------
// Генерация событий (моки)
const points = new PointsController(COUNT_OF_POINTS);
// ------------------------------------------------


// Шапка: информация, меню, фильтр
const headerMainBlock = document.querySelector(`.trip-main`);
render(headerMainBlock, new InfoComponent(points.getDestinations(), points.getDatesOfTrip()), RenderPosition.AFTERBEGIN);

const tripMainInfo = headerMainBlock.querySelector(`.trip-info`);
render(tripMainInfo, new TotalPriceComponent(points.getTotalPrice()), RenderPosition.BEFOREEND);

const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);
render(menuBlock, new MenuComponent(), RenderPosition.AFTEREND);
render(filterBlock, new FilterComponent(), RenderPosition.AFTEREND);


// Контент: сортировка, события, редактирование
const pointsListBlock = document.querySelector(`.trip-events`);

new TripController(pointsListBlock).render(points.getPoints(), points.getDestinations());
