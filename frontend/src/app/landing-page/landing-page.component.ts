import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Info variables (success, error, loading)
  loading: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loading = true;

    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.checkIsAdmin();

    this.loading = false;
  }

  onContinue(): void {
    this.router.navigateByUrl('wall');
  }
}
