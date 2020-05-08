import NoPointsComponent from '../components/no-points.js';
import PointComponent from '../components/point.js';
import PointDayComponent from '../components/point-day.js';
import PointEditComponent from '../components/point-edit.js';
import PointListComponent from '../components/point-list.js';
import SortComponent from '../components/sort.js';

import {groupPointsByDate} from '../calculations/common.js';
import {render, replace, RenderPosition} from "../utils/render.js";

let tripDestinations;

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

  const pointDayElement = new PointDayComponent(date, index);
  const pointDayListBlock = pointDayElement.getElement().querySelector(`.trip-events__list`);

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
    groupPointsByDate(points).forEach((pointDay, index) => {
      renderPointDay(pointList, pointDay, index);
    });
  }
}
