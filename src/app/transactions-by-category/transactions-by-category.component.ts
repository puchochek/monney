import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-transactions-by-category',
	templateUrl: './transactions-by-category.component.html',
	styleUrls: ['./transactions-by-category.component.scss']
})
export class TransactionsByCategoryComponent implements OnInit {

	constructor(
		private transactionService: TransactionService,
		private route: ActivatedRoute,

	) { }

	ngOnInit() {
		const categoryName = this.route.snapshot.paramMap.get('category');
		const transactions = this.transactionService.getTransactionsByCategorty(categoryName);
		console.log('---> transactions ', transactions);
	}

}
