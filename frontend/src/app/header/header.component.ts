import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Toggle menu for mobile display
  toggle: boolean = false;

  searchText: string = '';

  // fontawesome icons for mobile display menu
  faBars = faBars;

  constructor(
    private router: Router,
    private authService: AuthService,
    ) { 
      router.events
      .subscribe((event) => {
        // Close menu (on mobile display) when route changes
        if (event instanceof NavigationEnd) {
          this.toggle = false;
        }
      });
    }

  ngOnInit(): void {
    // Get current user id and role (admin or not)
    this.authService.checkIsAuth()
    .then((v) => {
        this.isAuth = v
        this.userId = this.isAuth.userId;
        this.isAdmin = this.isAuth.isAdmin;
      })
    .catch((e) => {
        this.isAuth = null
    })
  }

  // Toggle menu for mobile display
  onToggle() {
    this.toggle = !this.toggle;
  }
}
