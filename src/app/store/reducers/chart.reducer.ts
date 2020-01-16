import { Action } from '@ngrx/store';
import * as ChartActions from './../actions/chart.actions';
import { ChartState, initialChartState } from '../state/chart.state';

export function reducer(state: ChartState = initialChartState, action: ChartActions.Actions) {
    switch (action.type) {
        case ChartActions.ADD_CHART_DATA:
            return [{ ...state }, action.payload];
        default:
            return state;
    }
}