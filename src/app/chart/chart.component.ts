import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChartState } from '../store/state/chart.state';
import { ChartItem, DatePickerSetup, Category, ApplicationUser, CheckboxItem, ChartData } from '../interfaces';
import * as ChartActions from '../store/actions/chart.actions';
import { Observable } from 'rxjs/Observable';


@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

	constructor(
		private router: Router,
		private store: Store<ChartState>

	) {
		console.log('---> getCurrentNavigation.state.data ', router.getCurrentNavigation().extras.state);
		const chartData = <ChartData>router.getCurrentNavigation().extras.state;
		this.store.dispatch(new ChartActions.AddChartData(chartData));
	}

	ngOnInit() {
	}

}
