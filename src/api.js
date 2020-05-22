import Point from "./models/point.js";
import {RenderPosition} from "./utils/render.js";


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(authorization, container) {
    this._authorization = authorization;
    this._container = container;

    this.onLoad = this.onLoad.bind(this);
  }

  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
      .then(checkStatus)
      .then((response) => {
        if (response.status === 404) {
          return [];
        } else {
          return response.json();
        }
      })
      .then(Point.parsePoints);

  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/destinations`, {headers})
      .then(checkStatus)
      .then((response) => response.json());
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, {headers})
      .then(checkStatus)
      .then((response) => response.json());
  }

  onError(error) {
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

  updatePoint(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
      .then((response) => response.json())
      .then(Point.parsePoint);
  }
};

export default API;
