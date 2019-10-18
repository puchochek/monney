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
	categoryToEdit: any;
	categoryName: string;
	categoryDescription: string;
	categoryId: string;

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<AddCategoryModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
		this.categoryNameLabel = `Category name`;
		this.okBtnLabel = `OK`;
		this.closeBtnLabel = `Close`;
		if (this.data.category) {
			this.categoryToEdit = this.data.category;
			this.categoryName = this.categoryToEdit.name;
			this.categoryDescription = this.categoryToEdit.description;
			this.categoryId = this.categoryToEdit.id;
		}
		this.form = this.formBuilder.group({
			categoryName: this.categoryName,
			categoryDescription: this.categoryDescription
		})
	}

	submit(form: any) {
		const newCategoryInput = {
			name: form.value.categoryName,
			description: form.value.categoryDescription,
			id: this.categoryId
		};
		this.dialogRef.close(newCategoryInput);
	}
}
