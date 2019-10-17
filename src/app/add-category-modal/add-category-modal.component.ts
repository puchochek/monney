import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
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
		private dialogRef: MatDialogRef<AddCategoryModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
		this.categoryNameLabel = `Category name`;
		this.okBtnLabel = `OK`;
		this.closeBtnLabel = `Close`;
		const categoryToEdit = this.data.category;
		const categoryName = categoryToEdit ? categoryToEdit.name : '';
		const categoryDescription = categoryToEdit ? categoryToEdit.description : '';
		this.form = this.formBuilder.group({
			categoryName: categoryName,
			categoryDescription: categoryDescription
		})
	}

	submit(form: any) {
		const newCategoryInput = {
			name: form.value.categoryName,
			description: form.value.categoryDescription
		};
		this.dialogRef.close(newCategoryInput);

	}

}
