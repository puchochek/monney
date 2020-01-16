import { ChartData } from '../../interfaces';

export interface ChartState {
    readonly chartData: ChartData;
}

export const initialChartState: ChartState = {
    chartData: null
}