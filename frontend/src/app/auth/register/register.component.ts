import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Form variables
  registerForm!: FormGroup;
  emailRegex!: RegExp;

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;
  visiblePassword: boolean = false;

  // FontAwesome icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private AuthService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    // Set email regex
    this.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Register form
    this.registerForm = this.formBuilder.group({
      avatar: [null],
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  // If success registers the user in the database
  // If error shows error message
  onRegister(){
    const { email, username, password } = this.registerForm.value;
    this.AuthService.register(email, username, password)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => {
        // automatically logs in the user
        this.AuthService.login(email, password)
        .then(() => {
          // Redirects to home page
          window.location.href="/wall";
        })
      }
    })
  }

  // Show/hide the typed password
  toggleVisibility() {
    this.visiblePassword = !this.visiblePassword;
  }
}
