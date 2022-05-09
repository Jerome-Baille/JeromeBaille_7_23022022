import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
  visiblePassword: boolean = false;

  // FontAwesome icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder
              ) { }

  ngOnInit(): void {
    this.loading = true;

    this.authService.checkIsAuth()
    .then((v) => {
        this.isAuth = v
        this.userId = this.isAuth.userId;
        this.isAdmin = this.isAuth.isAdmin;
        this.loading = false;
      })
    .catch((e) => {
        this.isAuth = null
        this.loading = false;
    })

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
      // this.router.navigateByUrl('wall');
    })
    .catch((error) => {
      this.infoBox = {'errorMsg' : error.error.message, 'origin': 'login', 'id': 1}
    });
  }

  // Logout (the auth cookie is deleted by the API)
  onLogout() {
    this.authService.logout()
    .subscribe({
      next: (v) => console.log(v),
      error: (e) =>  this.infoBox = {'errorMsg' : e.error.message, 'origin': 'logout', 'id': 1},
      complete: () => window.location.reload()   
    })
  }

  // Show/hide the typed password
  toggleVisibility() {
    this.visiblePassword = !this.visiblePassword;
  }
}
