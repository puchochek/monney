import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
	@Input() sum: number;
	@Input() comment: string;

	transactionSumLbl: string = `sum`;
	transactionCommentLbl: string = `comment`;

	categoryName: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {

		this.categoryName = this.route.snapshot.paramMap.get('category');

	}

}
