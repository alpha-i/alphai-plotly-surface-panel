///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import {MetricsPanelCtrl} from 'app/plugins/sdk';

import _ from 'lodash';
import moment from 'moment';
import angular from 'angular';
import $ from 'jquery';

import * as Plotly from './lib/plotly.min';

class PlotlySurfacePanelCtrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/module.html';
  sizeChanged: boolean;
  initialized: boolean;

  $tooltip: any;
  data: any;
  layout: any;
  graph: any;

  mouse: any;

  defaults = {
    plotlyConfig: {
      layout: {
        title: 'Surface',
        autosize: true,
        margin: {
          l: 65,
          r: 50,
          b: 65,
          t: 90,
        },
        xaxis: {
          showgrid: true,
          type: 'linear',
          gridcolor: '#444444',
          rangemode: 'normal', // (enumerated: "normal" | "tozero" | "nonnegative" )
        },
        yaxis: {
          showgrid: true,
          type: 'linear',
          gridcolor: '#444444',
          rangemode: 'normal', // (enumerated: "normal" | "tozero" | "nonnegative" )
        },
        zaxis: {
          showgrid: true,
          type: 'linear',
          gridcolor: '#444444',
          rangemode: 'normal', // (enumerated: "normal" | "tozero" | "nonnegative" )
        },
        scene: {
          xaxis: {title: ''},
          yaxis: {title: ''},
          zaxis: {title: 'Amplitude'},
        },
      },
      settings: {
        date_field: 'timestamp',
        colorscale: 'Greens',
        showscale: true,
      },
    },
  };

  constructor($scope, $injector, $window, private $rootScope, private uiSegmentSrv) {
    super($scope, $injector);

    this.sizeChanged = true;
    this.initialized = false;

    this.$tooltip = $('<div id="tooltip" class="graph-tooltip">');

    _.defaultsDeep(this.panel, this.defaults);

    this.data = {time_series: [], column_series: [], value_series: []};
    this.layout = $.extend(true, {}, this.panel.plotlyConfig.layout);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('panel-initialized', this.onPanelInitialized.bind(this));
    this.events.on('panel-size-changed', this.onResize.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));

    angular.element($window).bind('resize', this.onResize.bind(this));
  }

  onInitEditMode() {
    console.log('OnInitEdit');
    this.addEditorTab(
      'Plugin Settings',
      'public/plugins/alphai-plotly-surface-panel/partials/tab_display.html',
      2
    );
    this.refresh();
  }

  onRender() {
    console.log('onRender');
    // ignore fetching data if another panel is in fullscreen
    if (this.otherPanelInFullscreenMode() || !this.graph) {
      return;
    }
    let options = {};

    if (!this.initialized) {
      options = {
        showLink: false,
        displaylogo: false,
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud'],
        responsive: true,
      };
    }

    this.layout = $.extend(true, {}, this.panel.plotlyConfig.layout);
    let rect = this.graph.getBoundingClientRect();

    this.layout.height = this.height;
    this.layout.width = rect.width;

    console.log(this.layout);
    let data = [
      {
        z: this.data.value_series || [],
        y: this.data.time_series || [],
        x: this.data.column_series.shift() || [],
        type: 'surface',
        colorscale: this.panel.plotlyConfig.settings.colorscale,
        showscale: this.panel.plotlyConfig.settings.showscale,
      },
    ];

    if (this.hasData(data[0])) {
      Plotly.react(this.graph, data, this.layout, options);
      this.initialized = true;
    }

    this.sizeChanged = false;
  }

  hasData(data) {
    return data.x.length > 0 && data.y.length > 0 && data.z.length > 0;
  }

  onDataReceived(dataList) {
    this.initialized = false;

    let data = {};
    if (dataList.length > 0) {
      let datapoints = dataList[0].datapoints.reverse();

      let value_series = [];
      let time_series = [];
      let column_series = [];
      let unitOfMeasure = '';

      let date_field = this.panel.plotlyConfig.settings.date_field;

      datapoints.forEach(function(element) {
        let index = element[date_field][0];
        value_series.push(element['y']);
        time_series.push(index);
        column_series.push(element['x']);
        unitOfMeasure = element['unit_of_measure'];
      });

      data = {
        value_series: value_series,
        time_series: time_series,
        column_series: column_series,
        unitOfMeasure: unitOfMeasure,
      };
    } else {
      console.log('Data is empty');
    }
    this.data = data;
    this.render();
  }

  onDataError(err) {
    this.render([]);
  }

  onPanelInitialized() {
    this.onConfigChanged();
  }

  onRefresh() {
    if (this.otherPanelInFullscreenMode()) {
      return;
    }

    if (this.graph && this.initialized) {
      Plotly.redraw(this.graph);
    }
  }

  onResize() {
    this.sizeChanged = true;
    this.render();
  }

  onConfigChanged() {
    if (this.graph && this.initialized) {
      Plotly.Plots.purge(this.graph);
      this.graph.innerHTML = '';
      this.initialized = false;
    }

    this.refresh();
  }

  link(scope, elem, attrs, ctrl) {
    this.graph = elem.find('.plotly-surface-spot')[0];
    this.initialized = false;
    elem.on('mousemove', evt => {
      this.mouse = evt;
    });
  }
}

export {PlotlySurfacePanelCtrl as PanelCtrl};
