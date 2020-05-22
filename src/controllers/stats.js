import StatsComponent from "../components/stats.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {EventType} from "../const.js";
import {getDiffTime} from "../utils/common.js";

import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";


export default class StatsController {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._statsComponent = null;

    this._moneyStats = null;
    this._transportStats = null;
    this._timeStats = null;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._moneyCtx = null;
    this._transportCtx = null;
    this._timeSpentCtx = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldStatsComponent = this._statsComponent;
    this._statsComponent = new StatsComponent();

    this._moneyCtx = this._statsComponent.getElement().querySelector(`.statistics__chart--money`);
    this._transportCtx = this._statsComponent.getElement().querySelector(`.statistics__chart--transport`);
    this._timeSpentCtx = this._statsComponent.getElement().querySelector(`.statistics__chart--time`);

    if (oldStatsComponent) {
      replace(this._statsComponent, oldStatsComponent);
    } else {
      render(this._container, this._statsComponent, RenderPosition.BEFOREEND);
    }
    this.calc();
  }

  calc() {
    const points = this._pointsModel.getPoints();
    const selectAllTypes = Array.from(new Set(points.map((point) => point.type)));

    // Money
    const moneyValues = selectAllTypes.map((type) => {
      return points
      .filter((point) => point.type === type)
      .reduce((summ, currentPoint) => {
        return summ + currentPoint.basePrice;
      }, 0);
    });
    this._moneyStats = selectAllTypes
      .map((type, index) => {
        return {
          type,
          value: moneyValues[index]
        };
      })
      .sort((a, b) => b.value - a.value);

    // Transfer
    const selectTransportTypes = Array.from(selectAllTypes).filter((type) => EventType.TRANSFER.has(type));
    const transportValues = selectTransportTypes.map((type) => {
      return points.filter((point) => point.type === type).length;
    });
    this._transportStats = selectTransportTypes
      .map((type, index) => {
        return {
          type,
          value: transportValues[index]
        };
      })
      .sort((a, b) => b.value - a.value);

    // Time
    const timeTitles = points
      .map((point) => {
        return EventType.TRANSFER.has(point.type) ? `${point.type} to ${point.destination.name}` : point.type;
      });

    const timeValues = points.map((point) => {
      return Math.ceil(getDiffTime(point.dateFrom, point.dateTo).asHours());
    });

    const times = [];
    timeTitles
    .map((title, index) => {
      return {
        title,
        value: timeValues[index]
      };
    })
    .map((el) => {
      if (times.filter((time) => time.title === el.title).length === 0) {
        times.push(el);
      } else {
        const index = times.findIndex((elem) => elem.title === el.title);
        times[index].value = times[index].value + el.value;
      }
    });

    this._timeStats = times.sort((a, b) => b.value - a.value);
    this.canvas();
  }

  canvas() {
    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 55;
    this._moneyCtx.height = BAR_HEIGHT * this._moneyStats.length;
    this._transportCtx.height = BAR_HEIGHT * this._transportStats.length;
    this._timeSpentCtx.height = BAR_HEIGHT * this._timeStats.length;

    this._moneyChart = new Chart(this._moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._moneyStats.map((el) => el.type.toUpperCase()),
        datasets: [{
          data: this._moneyStats.map((el) => el.value),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          maxBarThickness: 44,
          minBarLength: 50,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    this._transportChart = new Chart(this._transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._transportStats.map((el) => el.type.toUpperCase()),
        datasets: [{
          data: this._transportStats.map((el) => el.value),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          maxBarThickness: 44,
          minBarLength: 50,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    this._timeChart = new Chart(this._timeSpentCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._timeStats.map((el) => el.title.toUpperCase()),
        datasets: [{
          data: this._timeStats.map((el) => el.value),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          maxBarThickness: 44,
          minBarLength: 50,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  show() {
    this._statsComponent.show();
  }

  hide() {
    this._statsComponent.hide();
  }

  _onDataChange() {
    this.calc();
    this.render();
  }
}
