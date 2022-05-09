import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-is-not-logged',
  templateUrl: './is-not-logged.component.html',
  styleUrls: ['./is-not-logged.component.scss']
})
export class IsNotLoggedComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // Redirect to login page
  onToLogin(): void {
    this.router.navigateByUrl('login');
  }
}
