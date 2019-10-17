import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-add-category-modal',
	templateUrl: './add-category-modal.component.html',
	styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent implements OnInit {
	form: FormGroup;
	categoryNameLabel: string;
	okBtnLabel: string;
	closeBtnLabel: string;

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<AddCategoryModalComponent>
	) { }

	ngOnInit() {
		this.categoryNameLabel = `New category name`;
		this.okBtnLabel = `OK`;
		this.closeBtnLabel = `Close`;
		this.form = this.formBuilder.group({
			categoryName: '',
			categoryDescription: ''
		})
	}

	submit(form: any) {
		const newCategoryInput = {
			name: form.value.categoryName,
			description: form.value.categoryDescription
		};
		// this.dialogRef.close(`${form.value.categoryName}`);
		this.dialogRef.close(newCategoryInput);

	}

}
