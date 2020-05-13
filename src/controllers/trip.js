import NoPointsComponent from '../components/no-points.js';
import PointController from './point.js';
import PointDayComponent from '../components/point-day.js';
import PointDayInfoComponent from '../components/point-day-info.js';
import PointListComponent from '../components/point-list.js';
import SortComponent, {SortType} from '../components/sort.js';

import {sortPointsByDate} from '../calculations/points.js';
import {getDiffTimeInMillisec} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";


const sortPoints = (points, sortType) => {
  const pointsForSort = points.slice();
  let sortedPoints = [];

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = sortPointsByDate(pointsForSort);
      break;

    case SortType.TIME:
      sortedPoints = pointsForSort.sort((a, b) => getDiffTimeInMillisec(b[`date-from`], b[`date-to`]) - getDiffTimeInMillisec(a[`date-from`], a[`date-to`]));
      break;

    case SortType.PRICE:
      sortedPoints = pointsForSort.sort((a, b) => b[`base-price`] - a[`base-price`]);
      break;
  }
  return sortedPoints;
};


export default class TripController {
  constructor(container, allDestinations, allOffers) {
    this._points = [];
    this._pointControllers = [];

    // Все возможные пункты назначения с описанием и фото
    this._allDestinations = allDestinations;
    this._allOffers = allOffers;


    this._container = container;
    this._pointsCointainer = ``;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._pointListComponent = new PointListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._currentSortType = this._sortComponent.getSortType();
  }

  render(points) {
    this._points = points;

    if (!this._points.length > 0) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
    this._pointsCointainer = this._container.querySelector(`.trip-days`);

    this._renderPointsBySortType(
        sortPoints(this._points, this._currentSortType)
    );
  }

  // Служебные функции для рендеринга точек
  // ------------------------------------------------
  _renderPoints(container, points) {
    return points.map((point) => {
      const pointController = new PointController(container, this._allDestinations, this._allOffers, this._onDataChange, this._onViewChange);
      pointController.render(point);
      return pointController;
    });
  }

  _renderPointDays(pointDay, index) {
    const {date, [`events`]: pointDayList} = pointDay;

    const pointDayComponent = new PointDayComponent();
    render(pointDayComponent.getPointDayInfoBlock(), new PointDayInfoComponent(date, index), RenderPosition.BEFOREEND);

    const pointDayListBlock = pointDayComponent.getPointDayListBlock();
    const pointControllers = this._renderPoints(pointDayListBlock, pointDayList);

    render(this._pointsCointainer, pointDayComponent, RenderPosition.BEFOREEND);

    return pointControllers;
  }

  _renderPointsBySortType(sortedPoints) {
    if (this._currentSortType === SortType.EVENT) {
      this._pointControllers = [].concat(
          ...sortedPoints.map((pointDay, index) => {
            return this._renderPointDays(pointDay, index);
          })
      );
    } else {
      const pointDayComponent = new PointDayComponent();
      render(this._pointsCointainer, pointDayComponent, RenderPosition.BEFOREEND);
      this._pointControllers = this._renderPoints(pointDayComponent.getPointDayListBlock(), sortedPoints);
    }
  }
  // ------------------------------------------------


  _onSortTypeChange(sortType) {
    this._currentSortType = sortType;

    this._pointsCointainer.innerHTML = ``;

    this._renderPointsBySortType(
        sortPoints(this._points, this._currentSortType)
    );
  }

  _onDataChange(oldData, newData) {
    const index = this._points.findIndex((point) => point === oldData);

    if (index === -1) {
      return;
    }

    const indexOfPointController = this._pointControllers.findIndex((controller) => controller.getPoint() === oldData);
    const pointController = this._pointControllers[indexOfPointController];

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(this._points[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((controller) => controller.setDefaultView());
  }
}
