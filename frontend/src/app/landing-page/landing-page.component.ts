import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  isAuth!: any;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkIsAuth()
    .subscribe({
      next: (v) => this.isAuth = v,
      error: (e) => this.isAuth = null,
    })
  }

  onContinue(): void {
    this.router.navigateByUrl('wall');
  }
}
