import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: any = [];
  userId!: number;

  constructor(private http: HttpClient) {}

// Authentification

  // Register
  register(email: string, username: string, password: string){
    return this.http.post('http://localhost:3000/api/users/register', {email, username, password}, {withCredentials: true});
  }

  // Login
  login(email: string, password: string){
    return this.http.post('http://localhost:3000/api/users/login', {email, password}, {withCredentials: true});
  }

  // Logout
  logout(){
    return this.http.get('http://localhost:3000/api/users/logout', {withCredentials: true});
  }

  // Check if the user is authenticated
  checkIsAuth(){
    return this.http.get('http://localhost:3000/api/users/isAuth', {withCredentials: true});
    // if(this.isAuth.length == 0){
    //   this.http.get(`http://localhost:3000/api/users/isAuth`, {withCredentials: true})
    //     .subscribe({
    //       next: (v) => {
    //         this.isAuth = v
    //         this.userId = this.isAuth.userId
    //       },
    //       error: () => this.isAuth = null,
    //       complete: () => console.log('complete')
    //     })
    //   return this.isAuth;
    // } else {
    //   return this.isAuth;
    // }
  }

  headerCheckIsAuth(){
    return this.http.get('http://localhost:3000/api/users/isAuth', {withCredentials: true});
  }
}