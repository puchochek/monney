import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//import {MatCardModule, MatButtonModule} from '@angular/material/card';
import { MatCardModule, MatButtonModule } from '@angular/material';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() message: string;
  @Input() status: string;
  @Output() onCloseModal = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    console.log('modal called');
  }

  getBorderColor(): string {
    if (this.status === 'saved') {
      return 'white';
    } else {
      return '#d50000';
    }
  }

  closeModal() {
    this.onCloseModal.emit({value: this.status});
  }
}
