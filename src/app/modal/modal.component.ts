import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  category: string;
  status: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    const selectedCategory = this.route.snapshot.paramMap.get('category');
    const resultStatus = this.route.snapshot.paramMap.get('status');
    this.category =  selectedCategory;
    this.status =  resultStatus;
  }

  getBorderColor(): string {
    if (this.status === 'saved') {
      return 'white';
    } else {
      return '#d50000';
    }
  }

  closeModal() {
    console.log('status ', status);
    if (this.status === 'saved') {
      this.router.navigate(['/categories']);
    } else {
      this.router.navigate(['/categories/' + this.category]);
    } 
  }
}
