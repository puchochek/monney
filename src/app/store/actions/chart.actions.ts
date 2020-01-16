import { Injectable } from '@angular/core'
import { Action } from '@ngrx/store'
import { ChartData } from '../../interfaces';

export const ADD_CHART_DATA = '[CHART_DATA] Add';

export class AddChartData implements Action {
    readonly type = ADD_CHART_DATA
    constructor(public payload: ChartData) { }
}

export type Actions = AddChartData;