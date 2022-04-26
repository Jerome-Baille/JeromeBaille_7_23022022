import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Form variables
  loginForm!: FormGroup;
  emailRegex!: RegExp;

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get current user id and role (admin or not)
    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.checkIsAdmin();

    if (isNaN(this.userId)) {
      this.authService.checkIsAuth()
      .subscribe({
        next: (v) => {
          this.isAuth = v
          this.userId = this.isAuth.userId;
          this.isAdmin = this.isAuth.isAdmin;  
        },
        error: (e) => this.isAuth = null,
      })
    }

    // Set email regex
    this.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Login form
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, [Validators.required]]
    });

    this.loading = false;
  }

  // Login and redirect to the main page if success
  onLogin() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
    .then(() => {
      window.location.href="/wall";
    })
    .catch((error) => {
      this.infoBox = {'errorMsg' : error.error.message}
    });
  }

  // Logout (the auth cookie is deleted by the API)
  onLogout() {
    this.authService.logout()
    .subscribe({
      next: (v) => console.log(v),
      error: (e) =>  this.infoBox = {'errorMsg' : e.error.message},
      complete: () => window.location.reload()   
    })
  }
}
