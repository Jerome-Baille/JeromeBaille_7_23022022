import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  emailRegex!: RegExp;
  errorMsg!: string;
  returnMsg!: string;
  isAuth!: any;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, [Validators.required]]
    });

    this.authService.headerCheckIsAuth()
    .subscribe({
      next: (v) => this.isAuth = v,
      error: () => this.isAuth = null,
    })
  }

  onLogin() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => this.router.navigate(['/'])
        .then(() =>{
          window.location.reload()
        })
    })
  }

  onLogout() {
    this.authService.logout()
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()   
    })
  }
}
