import {createInfo} from './components/info.js';
import {createTotalPrice} from './components/total-price.js';
import {createMenu} from './components/menu.js';
import {createFilter} from './components/filter.js';
import {createSort} from './components/sort.js';
import {createEditEventForm} from './components/edit-event-form.js';
import {createEventBlock} from './components/event-block.js';

const COUNT_OF_EVENTS = 3;


const renderHTMLElements = (container, block, place) => container.insertAdjacentHTML(place, block);

// Шапка: информация, меню, фильтр
const headerMainBlock = document.querySelector(`.trip-main`);
renderHTMLElements(headerMainBlock, createInfo(), `afterbegin`);

const tripMainInfo = headerMainBlock.querySelector(`.trip-info`);
renderHTMLElements(tripMainInfo, createTotalPrice(), `beforeend`);

const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);

renderHTMLElements(menuBlock, createMenu(), `afterend`);
renderHTMLElements(filterBlock, createFilter(), `afterend`);


// Контент: сортировка, события, редактирование
const eventsListBlock = document.querySelector(`.trip-events`);


renderHTMLElements(eventsListBlock, createSort(), `beforeend`);
renderHTMLElements(eventsListBlock, createEditEventForm(), `beforeend`);

for (let i = 1; i <= COUNT_OF_EVENTS; i++) {
  renderHTMLElements(eventsListBlock, createEventBlock(), `beforeend`);
}
