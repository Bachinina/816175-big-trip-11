import NoPointsComponent from '../components/no-points.js';
import PointComponent from '../components/point.js';
import PointDayComponent from '../components/point-day.js';
import PointDayInfoComponent from '../components/point-day-info.js';
import PointEditComponent from '../components/point-edit.js';
import PointListComponent from '../components/point-list.js';
import SortComponent, {SortType} from '../components/sort.js';

import {sortPointsByDate} from '../calculations/points.js';
import {getDiffTimeInMillisec} from "../utils/common.js";
import {render, replace, RenderPosition} from "../utils/render.js";

let tripDestinations;

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

const renderPointsBySortType = (list, sortedPoints, sortType) => {
  if (sortType === SortType.EVENT) {
    sortedPoints.forEach((pointDay, index) => {
      renderPointDay(list, pointDay, index);
    });
  } else {
    const container = new PointDayComponent();
    render(list, container, RenderPosition.BEFOREEND);

    sortedPoints.forEach((point) => {
      renderPoint(container.getPointDayListBlock(), point);
    });
  }
};


const renderPoint = (container, ...params) => {
  const [point, index] = params;

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToPoint();
    }
  };

  const replacePointToEdit = () => {
    replace(pointEditElement, pointElement);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceEditToPoint = () => {
    replace(pointElement, pointEditElement);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const pointElement = new PointComponent(point, index);
  pointElement.setEditButtonClickHandler(replacePointToEdit);

  const pointEditElement = new PointEditComponent(point, tripDestinations);
  pointEditElement.setFormSubmitHandler(replaceEditToPoint);
  pointEditElement.setCloseButtonClickHandler(replaceEditToPoint);


  render(container, pointElement, RenderPosition.BEFOREEND);
};

const renderPointDay = (container, ...params) => {
  const [pointDay, index] = params;
  const {date, [`events`]: pointDayList} = pointDay;

  const pointDayElement = new PointDayComponent();
  render(pointDayElement.getPointDayInfoBlock(), new PointDayInfoComponent(date, index), RenderPosition.BEFOREEND);

  const pointDayListBlock = pointDayElement.getPointDayListBlock();

  pointDayList.forEach((point) => {
    renderPoint(pointDayListBlock, point);
  });

  render(container, pointDayElement, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._PointListComponent = new PointListComponent();
  }

  render(points, destinations) {
    tripDestinations = destinations;

    if (!points.length > 0) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._PointListComponent, RenderPosition.BEFOREEND);
    const pointList = this._container.querySelector(`.trip-days`);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedPoints = sortPoints(points, sortType);
      pointList.innerHTML = ``;

      renderPointsBySortType(pointList, sortedPoints, sortType);
    });

    renderPointsBySortType(
        pointList,
        sortPoints(points, this._sortComponent.getSortType()),
        this._sortComponent.getSortType()
    );
  }
}
