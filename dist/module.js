System.register(["app/plugins/sdk", "lodash", "angular", "jquery", "./lib/plotly.min"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var sdk_1, lodash_1, angular_1, jquery_1, Plotly, PlotlySurfacePanelCtrl;
    return {
        setters: [
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (Plotly_1) {
                Plotly = Plotly_1;
            }
        ],
        execute: function () {
            PlotlySurfacePanelCtrl = (function (_super) {
                __extends(PlotlySurfacePanelCtrl, _super);
                function PlotlySurfacePanelCtrl($scope, $injector, $window, $rootScope, uiSegmentSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$rootScope = $rootScope;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.defaults = {
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
                                    rangemode: 'normal',
                                },
                                yaxis: {
                                    showgrid: true,
                                    type: 'linear',
                                    gridcolor: '#444444',
                                    rangemode: 'normal',
                                },
                                zaxis: {
                                    showgrid: true,
                                    type: 'linear',
                                    gridcolor: '#444444',
                                    rangemode: 'normal',
                                },
                                scene: {
                                    xaxis: { title: '' },
                                    yaxis: { title: '' },
                                    zaxis: { title: 'Amplitude' },
                                },
                            },
                            settings: {
                                date_field: 'timestamp',
                                colorscale: 'Greens',
                                showscale: true,
                                graph_type: 'surface'
                            },
                        },
                    };
                    _this.sizeChanged = true;
                    _this.initialized = false;
                    _this.$tooltip = jquery_1.default('<div id="tooltip" class="graph-tooltip">');
                    lodash_1.default.defaultsDeep(_this.panel, _this.defaults);
                    _this.data = { time_series: [], column_series: [], value_series: [] };
                    _this.layout = jquery_1.default.extend(true, {}, _this.panel.plotlyConfig.layout);
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('panel-initialized', _this.onPanelInitialized.bind(_this));
                    _this.events.on('panel-size-changed', _this.onResize.bind(_this));
                    _this.events.on('refresh', _this.onRefresh.bind(_this));
                    angular_1.default.element($window).bind('resize', _this.onResize.bind(_this));
                    return _this;
                }
                PlotlySurfacePanelCtrl.prototype.onInitEditMode = function () {
                    console.log('OnInitEdit');
                    this.addEditorTab('Plugin Settings', 'public/plugins/alphai-plotly-surface-panel/partials/tab_display.html', 2);
                    this.refresh();
                };
                PlotlySurfacePanelCtrl.prototype.onRender = function () {
                    console.log('onRender');
                    if (this.otherPanelInFullscreenMode() || !this.graph) {
                        return;
                    }
                    var options = {};
                    if (!this.initialized) {
                        options = {
                            showLink: false,
                            displaylogo: false,
                            displayModeBar: 'hover',
                            modeBarButtonsToRemove: ['sendDataToCloud'],
                            responsive: true,
                        };
                    }
                    this.layout = jquery_1.default.extend(true, {}, this.panel.plotlyConfig.layout);
                    var rect = this.graph.getBoundingClientRect();
                    this.layout.height = this.height;
                    this.layout.width = rect.width;
                    console.log(this.layout);
                    var data = [
                        {
                            z: this.data.value_series || [],
                            y: this.data.time_series || [],
                            x: this.data.column_series.shift() || [],
                            type: this.panel.plotlyConfig.settings.graph_type,
                            colorscale: this.panel.plotlyConfig.settings.colorscale,
                            showscale: this.panel.plotlyConfig.settings.showscale,
                        },
                    ];
                    if (this.hasData(data[0])) {
                        Plotly.react(this.graph, data, this.layout, options);
                        this.initialized = true;
                    }
                    this.sizeChanged = false;
                };
                PlotlySurfacePanelCtrl.prototype.hasData = function (data) {
                    return data.x.length > 0 && data.y.length > 0 && data.z.length > 0;
                };
                PlotlySurfacePanelCtrl.prototype.onDataReceived = function (dataList) {
                    this.initialized = false;
                    var data = {};
                    if (dataList.length > 0) {
                        var datapoints = dataList[0].datapoints.reverse();
                        var value_series_1 = [];
                        var time_series_1 = [];
                        var column_series_1 = [];
                        var unitOfMeasure_1 = '';
                        var date_field_1 = this.panel.plotlyConfig.settings.date_field;
                        datapoints.forEach(function (element) {
                            var index = element[date_field_1][0];
                            value_series_1.push(element['y']);
                            time_series_1.push(index);
                            column_series_1.push(element['x']);
                            unitOfMeasure_1 = element['unit_of_measure'];
                        });
                        data = {
                            value_series: value_series_1,
                            time_series: time_series_1,
                            column_series: column_series_1,
                            unitOfMeasure: unitOfMeasure_1,
                        };
                    }
                    else {
                        console.log('Data is empty');
                    }
                    this.data = data;
                    this.render();
                };
                PlotlySurfacePanelCtrl.prototype.onDataError = function (err) {
                    this.render([]);
                };
                PlotlySurfacePanelCtrl.prototype.onPanelInitialized = function () {
                    this.onConfigChanged();
                };
                PlotlySurfacePanelCtrl.prototype.onRefresh = function () {
                    if (this.otherPanelInFullscreenMode()) {
                        return;
                    }
                    if (this.graph && this.initialized) {
                        Plotly.redraw(this.graph);
                    }
                };
                PlotlySurfacePanelCtrl.prototype.onResize = function () {
                    this.sizeChanged = true;
                    this.render();
                };
                PlotlySurfacePanelCtrl.prototype.onConfigChanged = function () {
                    if (this.graph && this.initialized) {
                        Plotly.Plots.purge(this.graph);
                        this.graph.innerHTML = '';
                        this.initialized = false;
                    }
                    this.refresh();
                };
                PlotlySurfacePanelCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    var _this = this;
                    this.graph = elem.find('.plotly-surface-spot')[0];
                    this.initialized = false;
                    elem.on('mousemove', function (evt) {
                        _this.mouse = evt;
                    });
                };
                PlotlySurfacePanelCtrl.templateUrl = 'partials/module.html';
                return PlotlySurfacePanelCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("PanelCtrl", PlotlySurfacePanelCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map