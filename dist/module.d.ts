/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { MetricsPanelCtrl } from 'app/plugins/sdk';
declare class PlotlySurfacePanelCtrl extends MetricsPanelCtrl {
    private $rootScope;
    private uiSegmentSrv;
    static templateUrl: string;
    sizeChanged: boolean;
    initialized: boolean;
    $tooltip: any;
    data: any;
    layout: any;
    graph: any;
    mouse: any;
    defaults: {
        plotlyConfig: {
            layout: {
                title: string;
                autosize: boolean;
                margin: {
                    l: number;
                    r: number;
                    b: number;
                    t: number;
                };
                xaxis: {
                    showgrid: boolean;
                    type: string;
                    gridcolor: string;
                    rangemode: string;
                };
                yaxis: {
                    showgrid: boolean;
                    type: string;
                    gridcolor: string;
                    rangemode: string;
                };
                zaxis: {
                    showgrid: boolean;
                    type: string;
                    gridcolor: string;
                    rangemode: string;
                };
                scene: {
                    xaxis: {
                        title: string;
                    };
                    yaxis: {
                        title: string;
                    };
                    zaxis: {
                        title: string;
                    };
                };
            };
            settings: {
                date_field: string;
                colorscale: string;
                showscale: boolean;
                graph_type: string;
            };
        };
    };
    constructor($scope: any, $injector: any, $window: any, $rootScope: any, uiSegmentSrv: any);
    onInitEditMode(): void;
    onRender(): void;
    hasData(data: any): boolean;
    onDataReceived(dataList: any): void;
    onDataError(err: any): void;
    onPanelInitialized(): void;
    onRefresh(): void;
    onResize(): void;
    onConfigChanged(): void;
    link(scope: any, elem: any, attrs: any, ctrl: any): void;
}
export { PlotlySurfacePanelCtrl as PanelCtrl };
