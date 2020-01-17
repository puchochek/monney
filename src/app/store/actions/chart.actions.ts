import { Injectable } from '@angular/core'
import { Action } from '@ngrx/store'
import { ChartSetup } from '../../interfaces';

export const ADD_CHART_DATA = '[CHART_DATA] Add';

export class AddChartSetup implements Action {
    readonly type = ADD_CHART_DATA
    constructor(public payload: ChartSetup) { }
}

export type Actions = AddChartSetup;