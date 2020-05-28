import Point from "../models/point.js";
import {RenderPosition} from "../utils/render.js";


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusCode = {
  OK: 200,
  MultipleChoices: 300,
  NotFound: 404,
};


const checkStatus = (response) => {
  if (response.status >= StatusCode.OK && response.status < StatusCode.MultipleChoices) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization, container) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._container = container;

    this.onLoad = this.onLoad.bind(this);
  }

  getPoints() {
    return this._load({url: `points`})
      .then((response) => {
        if (response.status === StatusCode.NotFound) {
          return [];
        } else {
          return response.json();
        }
      })
      .then(Point.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(checkStatus)
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(checkStatus)
      .then((response) => response.json());
  }

  onError(error) {
    if (this._container.contains(this._container.querySelector(`.trip-events__msg--load`))) {
      this._container.querySelector(`.trip-events__msg--load`).remove();
    }
    error = `<p class="trip-events__msg">${error}</p>`;
    this._container.insertAdjacentHTML(RenderPosition.BEFOREEND, error);
  }

  onLoad() {
    const preloader = `<p class="trip-events__msg trip-events__msg--load">Loading...</p>`;

    if (this._container.querySelector(`.trip-events__msg--load`)) {
      this._container.querySelector(`.trip-events__msg--load`).remove();
    } else {
      this._container.insertAdjacentHTML(RenderPosition.BEFOREEND, preloader);
    }
  }

  createPoint(data) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Point.parsePoint);
  }

  updatePoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Point.parsePoint);
  }

  deletePoint(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
