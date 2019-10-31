import { Component, OnInit, Input } from '@angular/core';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';

@Component({
  selector: 'app-balance-view-balance',
  templateUrl: './balance-view-balance.component.html',
  styleUrls: ['./balance-view-balance.component.scss']
})
export class BalanceViewBalanceComponent implements OnInit {
  @Input() appUser: LoggedUser;

  constructor() { }

  ngOnInit() {
  }

}
