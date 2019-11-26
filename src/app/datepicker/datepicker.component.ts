import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';



@Component({
	selector: 'app-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
	@Output()
	dateInput: EventEmitter<MatDatepickerInputEvent<any>>;
	@Output()
	fromDateChange: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	toDateChange: EventEmitter<any> = new EventEmitter<any>();

	isValidFromDate: boolean = true;
	isValidToDate: boolean = true;
	maxFromDate: Date;
	maxToDate: Date;
	minToDate: Date;
	minFromDate: Date;
	toDateValue: FormControl;
	fromDateValue: FormControl;

	constructor() { }

	ngOnInit() {
		const today = new Date();
		this.toDateValue = new FormControl(today);
		this.fromDateValue = new FormControl(new Date(today.getFullYear(), today.getMonth(), 1));
		this.maxToDate = today;
	}

	onDateInputFrom(event) {
		this.isValidFromDate = true;
		const newDate = event.target.value;
		this.minToDate = newDate;
		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			this.fromDateChange.emit(newDate);
		} else {
			this.isValidFromDate = false;
		}
		console.log('---> onDateInputFrom ', newDate);
	}

	onDateInputTo(event) {
		this.isValidToDate = true;
		const newDate = event.target.value;
		this.maxFromDate = newDate;
		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			this.toDateChange.emit(newDate);
		} else {
			this.isValidToDate = false;
		}
		console.log('---> onDateInputTo ', newDate);
	}

	validateInputDate(newDate: Date): boolean {
		if (newDate instanceof Date && !(newDate > new Date())) {
			return true;
		} else {
			return false;
		}
	}

}
