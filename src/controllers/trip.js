import NoPointsComponent from '../components/no-points.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point.js';
import PointDayComponent from '../components/point-day.js';
import PointDayInfoComponent from '../components/point-day-info.js';
import PointListComponent from '../components/point-list.js';
import SortComponent, {SortType} from '../components/sort.js';

import {sortPointsByDate} from '../calculations/points.js';
import {getDiffTime} from "../utils/common.js";
import {render, remove, replace, RenderPosition} from "../utils/render.js";
import {FilterType} from "../const.js";

export const TripControllerMode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  STATS: `edit`,
  NO_POINTS: `no-points`,
};


const sortPoints = (points, sortType) => {
  const pointsForSort = points.slice();
  let sortedPoints = [];

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = sortPointsByDate(pointsForSort);
      break;

    case SortType.TIME:
      sortedPoints = pointsForSort.sort((a, b) => getDiffTime(b[`date-from`], b[`date-to`]) - getDiffTime(a[`date-from`], a[`date-to`]));
      break;

    case SortType.PRICE:
      sortedPoints = pointsForSort.sort((a, b) => b[`base-price`] - a[`base-price`]);
      break;
  }
  return sortedPoints;
};


export default class TripController {
  constructor(container, pointsModel) {
    this._pointControllers = [];
    this._pointsModel = pointsModel;
    this._mode = TripControllerMode.DEFAULT;


    this._container = container;
    this._pointsCointainer = null;
    this._pointDayContainers = [];


    this._noPointsComponent = null;
    this._sortComponent = new SortComponent();
    this._pointListComponent = new PointListComponent();
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onPointCreate = this._onPointCreate.bind(this);
    this._update = this._update.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._currentSortType = this._sortComponent.getSortType();
    this._pointsModel.setDataChangeHandler(this._update);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._pointsModel.setPointCreateHandler(this._onPointCreate);

  }

  render() {
    const points = this._pointsModel.getFiltredPoints();

    if (this._mode !== TripControllerMode.ADDING) {
      this._mode = points.length > 0
        ? TripControllerMode.DEFAULT
        : TripControllerMode.NO_POINTS;
    }

    switch (this._mode) {
      case TripControllerMode.NO_POINTS:
        remove(this._sortComponent);
        remove(this._pointListComponent);

        const oldNoPointsComponent = this._noPointsComponent;
        this._noPointsComponent = new NoPointsComponent();
        if (oldNoPointsComponent) {
          replace(this._noPointsComponent, oldNoPointsComponent);
        } else {
          render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
        }
        break;

      case TripControllerMode.DEFAULT:
        render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
        render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
        this._pointsCointainer = this._container.querySelector(`.trip-days`);

        this._renderPointsBySortType(
            sortPoints(points, this._currentSortType)
        );
        break;

      case TripControllerMode.ADDING:
        if (this._noPointsComponent) {
          remove(this._noPointsComponent);
          this._noPointsComponent = null;
        }
        if (this._pointListComponent) {
          remove(this._pointListComponent);
          this._pointListComponent = null;
        }
        this._pointListComponent = new PointListComponent();
        render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
    }
  }

  // Служебные функции для рендеринга точек
  // ------------------------------------------------
  _renderPoints(container, points) {
    return points.map((point) => {
      const pointController = new PointController(container, this._pointsModel, this._onDataChange, this._onViewChange);
      pointController.render(point, PointControllerMode.DEFAULT);
      return pointController;
    });
  }

  _renderPointDays(pointDay, index) {
    const {date, [`events`]: pointDayList} = pointDay;

    const pointDayComponent = new PointDayComponent();
    this._pointDayContainers.push(pointDayComponent);
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
      this._pointDayContainers.push(pointDayComponent);

      render(this._pointsCointainer, pointDayComponent, RenderPosition.BEFOREEND);
      this._pointControllers = this._renderPoints(pointDayComponent.getPointDayListBlock(), sortedPoints);
    }
  }
  // ------------------------------------------------

  _onDataChange(oldData, newData, openEditForm = false) {
    if (oldData === EmptyPoint) {

      this._mode = this._pointsModel.getPoints().length > 0
        ? TripControllerMode.DEFAULT
        : TripControllerMode.NO_POINTS;

      if (newData === null) {
        this._onPointCreateDelete();
        this._update();
      } else {
        this._pointsModel.addPoint(newData);
        this._creatingPoint.destroy();
        this._creatingPoint = null;
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
      if (isSuccess && openEditForm) {
        let pointController;
        const indexOfPointController = this._pointControllers.findIndex((controller) => controller.getPoint() === newData);
        if (indexOfPointController !== -1) {
          pointController = this._pointControllers[indexOfPointController];
        }
        pointController.render(newData, PointControllerMode.DEFAULT, true);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((controller) => controller.setDefaultView());
    if (this._mode === TripControllerMode.ADDING && this._pointsModel.getPoints().length > 0) {
      this._onPointCreateDelete();
      this._mode = TripControllerMode.DEFAULT;
    }
  }

  _onFilterChange() {
    this._resetSort();
    this._update();
  }

  _onSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._update();
  }

  _onPointCreate() {
    if (this._creatingPoint) {
      return;
    }
    this._creatingPoint = null;

    if (this._mode === TripControllerMode.NO_POINTS) {
      this._mode = TripControllerMode.ADDING;
      this.render();
    }

    if (!this._resetFilter()) {
      this._resetSort();
    }

    const pointListElement = this._pointListComponent.getElement();
    this._creatingPoint = new PointController(pointListElement, this._pointsModel, this._onDataChange, this._onViewChange);

    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    this._mode = TripControllerMode.ADDING;
  }

  _onPointCreateDelete() {
    this._pointsModel.deleteCreatedPoint();
    this._creatingPoint.destroy();
    this._creatingPoint = null;
  }

  _resetFilter() {
    if (this._pointsModel.getFilter() !== FilterType.EVERY) {
      this._pointsModel.setFilter(FilterType.EVERY);
      return true;
    }
    return false;
  }

  _resetSort() {
    if (this._sortComponent.reset()) {
      this._onSortTypeChange(this._sortComponent.getSortType());
    }
  }

  _clear() {
    if (this._pointControllers.length > 0) {
      this._pointControllers.forEach((controller) => controller.destroy());
      this._pointControllers = [];
    }
    if (this._pointDayContainers.length > 0) {
      this._pointDayContainers.forEach((container) => remove(container));
      this._pointDayContainers = [];
    }
  }

  _update() {
    this._clear();

    if (this._pointsModel.getPoints().length === 0) {
      this._mode = TripControllerMode.NO_POINTS;
    }

    if (this._mode === TripControllerMode.ADDING) {
      this._mode = TripControllerMode.DEFAULT;
    }
    this.render();
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  hide() {
    this._resetSort();
    this._container.classList.add(`trip-events--hidden`);
  }
}
