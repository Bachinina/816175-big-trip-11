import {calcTotalPrice} from './sort/total-price.js';
import {createEditPointForm} from './components/edit-point-form.js';
import {createFilter} from './components/filter.js';
import {createInfo} from './components/info.js';
import {createMenu} from './components/menu.js';
import {createPointList} from './components/point-list.js';
import {createSort} from './components/sort.js';
import {createTotalPrice} from './components/total-price.js';

import {generatePoints} from './mock/point.js';
import {getTripDates, sortPoints, selectDestinations} from './sort/start-sort.js';

const COUNT_OF_POINTS = 15;


const points = generatePoints(COUNT_OF_POINTS);

const sortedPoints = sortPoints(points.slice(1));
const datesOfTrip = getTripDates(sortedPoints);

const destinations = selectDestinations(points.slice(1));
const totalPrice = calcTotalPrice(points.slice(1));


const renderHTMLElements = (container, block, place) => container.insertAdjacentHTML(place, block);

// Шапка: информация, меню, фильтр
const headerMainBlock = document.querySelector(`.trip-main`);
renderHTMLElements(headerMainBlock, createInfo(destinations, datesOfTrip), `afterbegin`);

const tripMainInfo = headerMainBlock.querySelector(`.trip-info`);
renderHTMLElements(tripMainInfo, createTotalPrice(totalPrice), `beforeend`);

const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);

renderHTMLElements(menuBlock, createMenu(), `afterend`);
renderHTMLElements(filterBlock, createFilter(), `afterend`);


// Контент: сортировка, события, редактирование
const pointsListBlock = document.querySelector(`.trip-events`);


renderHTMLElements(pointsListBlock, createSort(), `beforeend`);
renderHTMLElements(pointsListBlock, createEditPointForm(points[0], destinations), `beforeend`);

renderHTMLElements(pointsListBlock, createPointList(sortedPoints), `beforeend`);

