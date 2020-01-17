import { ChartSetup } from '../../interfaces';

export interface ChartState {
    readonly chartData: ChartSetup;
}

export const initialChartState: ChartState = {
    chartData: null
}