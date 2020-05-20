import MenuComponent, {MenuMode} from './components/menu.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';
import PointAddBtnController from './controllers/point-add-btn.js';
import TripController from './controllers/trip.js';
import InfoController from './controllers/info.js';
import StatsController from './controllers/stats.js';

import {render, RenderPosition} from "./utils/render.js";


const COUNT_OF_POINTS = 10;

// Генерация событий (моки)
// ------------------------------------------------
const pointsModel = new PointsModel();
pointsModel.generate(COUNT_OF_POINTS);
// ------------------------------------------------


// Шапка: информация, меню, фильтр
const headerMainBlock = document.querySelector(`.trip-main`);
new InfoController(headerMainBlock, pointsModel).render();

const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);

const menuComponent = new MenuComponent(MenuMode.TABLE);
render(menuBlock, menuComponent, RenderPosition.AFTEREND);
new FilterController(filterBlock, pointsModel).render();

const pointAddBtnController = new PointAddBtnController(headerMainBlock, pointsModel);
pointAddBtnController.render();


// Контент: сортировка, события, редактирование
const pointsListBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(pointsListBlock, pointsModel);
tripController.render();


// Статистика
const statsListBlock = document.querySelector(`.statistics`);
const statistics = new StatsController(statsListBlock, pointsModel);
statistics.render();


menuComponent.setMenuClickHandler((activeMode) => {
  switch (activeMode) {
    case MenuMode.STATS:
      menuComponent.setActiveMode(activeMode);
      tripController.hide();
      statistics.show();
      break;
    case MenuMode.TABLE:
      menuComponent.setActiveMode(activeMode);
      tripController.show();
      statistics.hide();
      break;
  }
});
