export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.basePrice = data[`base_price`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.destination = {
      description: data[`destination`][`description`],
      name: data[`destination`][`name`],
      pictures: data[`destination`][`pictures`]
    };
    this.isFavorite = data[`is_favorite`];
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "base_price": this.basePrice,
      "date_from": this.dateFrom,
      "date_to": this.dateTo,
      "destination": {
        "description": this.destination.description,
        "name": this.destination.name,
        "pictures": this.destination.pictures,
      },
      "is_favorite": this.isFavorite,
      "offers": this.offers
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
