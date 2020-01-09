import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

	message: string;
	additionalInfo: string;
	confirmBtnLbl: string = `ok`;
	closeBtnLbl: string = `close`;

	constructor(
		private dialogRef: MatDialogRef<ConfirmationModalComponent>,
		@Inject(MAT_DIALOG_DATA) private data
	) { }

	ngOnInit() {
		if (this.data) {
			this.message = this.data.message;
		}
		if (this.data.itemInfo) {
			this.additionalInfo = this.data.itemInfo;
		}
	}

	closeModal() {
		this.dialogRef.close(false);
	}

	confirmAction() {
		this.dialogRef.close(true);
	}
}
