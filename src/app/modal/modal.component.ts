import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';


@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
	message: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dialogRef: MatDialogRef<ModalComponent>,
		@Inject(MAT_DIALOG_DATA) private dialogData
	) { }

	ngOnInit() {
		this.message = this.dialogData.message;
	}

	confirmModalMessage() {
		this.dialogRef.close(true);
	}

}
