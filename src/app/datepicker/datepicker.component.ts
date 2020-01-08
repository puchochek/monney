import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { DatePickerSetup } from '../interfaces';

@Component({
	selector: 'app-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
	@Input()
	datePickerSetup: DatePickerSetup;
	@Output()
	dateInput: EventEmitter<MatDatepickerInputEvent<any>>;
	@Output()
	dateChange: EventEmitter<any> = new EventEmitter<any>();

	isValidDate: boolean = true;
	minDate: Date;
	maxDate: Date;
	dateValue: FormControl;
	placeholder: string;
	dateInputValue: string;

	constructor() { }

	ngOnInit() {
		const today = new Date();
		this.dateValue = new FormControl(today);
		this.minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		this.maxDate = new Date();
		if (!this.datePickerSetup.isFromDate && !this.datePickerSetup.isToDate) {
			this.placeholder = `placeholder-single`;
			this.dateInputValue = `date-input-single`;
		} else {
			this.placeholder = `placeholder-multiply`;
			this.dateInputValue = `date-input-multiply`;
		}
	}

	onDateInput(event) {
		this.isValidDate = true;
		const newDate = event.target.value;

		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			// if (this.datePickerSetup.isFromDate) {
			// 	console.log('---> isFromDate ' );
			// 	this.minDate = newDate;
			// }
			// if (this.datePickerSetup.isToDate) {
			// 	console.log('---> isToDate ' );
			// 	this.maxDate = newDate;
			// }
			this.dateChange.emit(newDate);
		} else {
			this.isValidDate = false;
		}
	}

	validateInputDate(newDate: Date): boolean {
		if (newDate instanceof Date && !(newDate > new Date())) {
			return true;
		} else {
			return false;
		}
	}
}
