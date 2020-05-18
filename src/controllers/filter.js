import FilterComponent from '../components/filter.js';
import {getPointsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

import {render, replace, RenderPosition} from "../utils/render.js";


export default class FilterController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;

    this._container = container;
    this._filterComponent = null;

    this._activeFilterType = FilterType.EVERY;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterClick = this._onFilterClick.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const points = this._pointsModel.getPoints();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
        count: getPointsByFilter(points, filterType).length,
      };
    });

    const oldFilterComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters, this._activeFilterType);
    this._filterComponent.setFilterChangeHandler(this._onFilterClick);


    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTEREND);
    }

  }

  _onFilterClick(filterType) {
    this._pointsModel.setFilter(filterType);
  }

  _onFilterChange() {
    this._activeFilterType = this._pointsModel.getFilter();
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
