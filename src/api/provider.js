import Point from "../models/point.js";
import {nanoid} from "nanoid";


const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (points) => {
  return points.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (points) => {
  return points.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needToSync = false;

    this.onError = this.onError.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const elements = createStoreStructure(points.map((point) => point.toRAW()));
          this._store.setItem(`points`, elements);
          return points;
        });
    }
    const storePoints = Object.values(this._store.getItems(`points`));
    return Promise.resolve(Point.parsePoints(storePoints));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem(`destinations`, destinations);
          return destinations;
        });
    }
    const storeDestinations = this._store.getItems(`destinations`);
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem(`offers`, offers);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems(`offers`));
    return Promise.resolve(storeOffers);
  }

  createPoint(data) {
    if (isOnline()) {
      return this._api.createPoint(data)
      .then((newPoint) => {
        this._store.setItemElement(`points`, [newPoint.id, newPoint.toRAW()]);
        return newPoint;
      });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(data, {id: localNewPointId}));

    this._store.setItemElement(`points`, [localNewPoint.id, localNewPoint.toRAW()]);

    this._needToSync = true;
    return Promise.resolve(localNewPoint);
  }

  updatePoint(id, data) {
    if (isOnline()) {
      return this._api.updatePoint(id, data)
        .then((newPoint) => {
          this._store.setItemElement(`points`, [newPoint.id, newPoint.toRAW()]);
          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(data, {id}));
    this._store.setItemElement(`points`, [localPoint.id, localPoint.toRAW()]);

    this._needToSync = true;
    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItemElement(`points`, id));
    }

    this._store.removeItemElement(`points`, id);
    this._needToSync = true;
    return Promise.resolve();
  }


  onError(error) {
    return this._api.onError(error);
  }

  onLoad() {
    return this._api.onLoad();
  }


  sync() {
    if (isOnline()) {
      if (this._needToSync) {
        this._needToSync = false;
        const storePoints = Object.values(this._store.getItems(`points`));

        return this._api.sync(storePoints)
          .then((response) => {
            const createdPoints = getSyncedPoints(response.created);
            const updatedPoints = getSyncedPoints(response.updated);

            const points = createStoreStructure([...createdPoints, ...updatedPoints]);
            this._store.setItem(`points`, points);
          });
      } else {
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error(`Sync data failed`));
  }
}
