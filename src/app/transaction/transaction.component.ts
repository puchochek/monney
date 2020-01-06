import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePickerSetup } from '../interfaces';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
	@Input() sum: number;
	@Input() comment: string;
	@Input() date: Date;

	transactionSumLbl: string = `sum`;
	transactionCommentLbl: string = `comment`;
	datePickerSetup: DatePickerSetup = {
		placeholder: `date`,
		maxDate: new Date(),
		minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		isFromDate: false,
		isToDate: false
	};

	categoryName: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {

		this.categoryName = this.route.snapshot.paramMap.get('category');

	}

	handleDateChange(newDate: Date) {
		console.log('---> newDate TR ', newDate);
		this.date = newDate
	}

}
