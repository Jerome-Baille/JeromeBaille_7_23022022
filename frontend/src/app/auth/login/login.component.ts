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

  constructor(private AuthService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, [Validators.required]]
    });
  }

  // onSubmitForm(): void {
  //   const { email, password } = this.loginForm.value;
  //   this.FaceSnapsService.login(email, password);
  // }

  onLogin() {
    const { email, password } = this.loginForm.value;
    this.AuthService.login(email, password)
    .subscribe(()=>{
      this.router.navigate(['/']);
    },
    (error: any) => {
      this.errorMsg = error.error.message
    })
  }

  onLogout(): void {
    // fetch('http://localhost:3000/api/users/logout', {
    //   method: 'get',
    //   credentials: 'include'
  
    // }).then(function(response) {
    //   console.log(response)
  
    // }).catch(function(err) {
    //   console.log(err);
    // });


    this.AuthService.logout()
    .subscribe(data => {
      // this.returnMsg = JSON.stringify(data)
      console.log(JSON.stringify(data))
    },
    (error: any) => {
      console.log(error)
    })

    // this.router.navigate(['/'])
  }
}
