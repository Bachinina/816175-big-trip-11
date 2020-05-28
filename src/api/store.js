export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems(directory = null) {
    try {
      if (directory) {
        return JSON.parse(this._storage.getItem(this._storeKey))[directory] || [];
      }
      return JSON.parse(this._storage.getItem(this._storeKey)) || [];
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  setItemElement(directory, element) {
    const [key, value] = element;
    const elementsInStore = this.getItems(directory);
    elementsInStore[key] = value;
    this.setItem(directory, elementsInStore);
  }

  removeItemElement(directory, key) {
    const elementsInStore = this.getItems(directory);
    delete elementsInStore[key];
    this.setItem(directory, elementsInStore);
  }
}
