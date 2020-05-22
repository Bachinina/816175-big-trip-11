import API from "./api.js";
import FilterController from './controllers/filter.js';
import InfoController from './controllers/info.js';
import MenuComponent, {MenuMode} from './components/menu.js';
import PointsModel from './models/points.js';
import PointAddBtnController from './controllers/point-add-btn.js';
import StatsController from './controllers/stats.js';
import TripController from './controllers/trip.js';
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic dXNlcDbmDJHDjo=`;
const pointsModel = new PointsModel();

const headerMainBlock = document.querySelector(`.trip-main`);
const menuBlock = headerMainBlock.querySelector(`#menu-block`);
const filterBlock = headerMainBlock.querySelector(`#events-filter`);
const pointsListBlock = document.querySelector(`.trip-events`);
const statsListBlock = document.querySelector(`.statistics`);


const api = new API(AUTHORIZATION, pointsListBlock);


const menuComponent = new MenuComponent(MenuMode.TABLE);
const infoController = new InfoController(headerMainBlock, pointsModel);
const pointAddBtnController = new PointAddBtnController(headerMainBlock, pointsModel);
const filterController = new FilterController(filterBlock, pointsModel);
const tripController = new TripController(pointsListBlock, pointsModel, api);
const statistics = new StatsController(statsListBlock, pointsModel);


render(menuBlock, menuComponent, RenderPosition.AFTEREND);
infoController.render();
filterController.render();

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


// Работа с данными
// -------------------------------------
const loadDestinations = () => {
  return api.getDestinations()
    .then((destinations) => {
      if (destinations) {
        pointsModel.setDestinations(destinations);
      }
      return destinations;
    })
    .catch(() => {
      api.onError(`Ooops, SPA can't fetch destination list :(`);
    });
};

const loadOffers = () => {
  return api.getOffers()
    .then((offers) => {
      if (offers) {
        pointsModel.setOffers(offers);
      }
      return offers;
    })
    .catch(() => {
      api.onError(`Ooops, SPA can't fetch offer list :(`);
    });
};
const loadInfo = Promise.all([loadDestinations(), loadOffers()]);

loadInfo
  .then((result) => {
    if (result.every((el) => el !== undefined)) {
      api.getPoints()
      .then((points) => {
        if (points) {
          api.onLoad();
          pointsModel.setPoints(points);
          infoController.render();
          filterController.render();
          pointAddBtnController.render();
          tripController.render();
        }
      })
      .catch(() => {
        api.onError(`Ooops, SPA can't fetch point list :(`);
      });
    }
  })
  .then(() => {
    statistics.render();
  })
  .then(api.onLoad);
// -------------------------------------
