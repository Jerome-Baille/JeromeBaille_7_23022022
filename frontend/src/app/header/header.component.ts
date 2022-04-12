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
  isAuth: any = [];
  toggle: boolean = false;
  isMobileLayout: boolean = false;

  
  faBars = faBars;

  constructor(
    private authService: AuthService,
    private router: Router
    ) { 
      router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.toggle = false;
        }
      });
    }

  ngOnInit(): void {
    this.authService.headerCheckIsAuth()
    .subscribe({
      next: (v) => this.isAuth = v,
      error: () => this.isAuth = null
    })

    window.onresize = () => this.isMobileLayout = window.innerWidth <= 768;
  }


  onToggle() {
    this.toggle = !this.toggle;
  }
}
