import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit {

  status: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    console.log('token ', token);
    this.activateUser(token);
  }

  activateUser(token: string) {
    this.http.post('http://localhost:3000/user/token', {
      token: token,
    }).subscribe((result) => {
      console.log('result ', result);
      if (result) {
        this.status = 'success';
      } else {
        this.status = 'error';
      }
      this.router.navigate(['/categories/' + this.status]);
    });
  }

}
