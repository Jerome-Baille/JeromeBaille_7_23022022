import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  observer$!: Observable<any>;
  isAuth: any = [];
  userId!: any;
  isAdmin!: boolean;

  constructor(private http: HttpClient) {}

// Authentification

  // Register
  register(email: string, username: string, password: string){
    return this.http.post('http://localhost:3000/api/users/register', {email, username, password}, {withCredentials: true});
  }

  // Login
  login(email: string, password: string){
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/users/login', {email, password}, {withCredentials: true})
        .subscribe({
          next: (v) => {
            this.isAuth = v;
            this.userId = this.isAuth.userId;
            this.isAdmin = this.isAuth.isAdmin;
            resolve(v)
          },
          error: (err) => {
            this.isAuth = null
            reject(err)
          }
        })
    })
    
  }

  // Logout
  logout(){
    this.userId = null;
    this.isAdmin = false;
    return this.http.get('http://localhost:3000/api/users/logout', {withCredentials: true});
  }

  // Check if the user is admin
  checkIsAdmin(){
    return this.isAdmin;
  }

  // Get the user id
  getUserId(){
    return this.userId; 
  }

  // Check if the user is authenticated
  checkIsAuth(){
    return this.http.get('http://localhost:3000/api/users/isAuth', {withCredentials: true})

    // if return 403, token is not found
    // if return 200, then the user is authenticated
    // if return 401, then the user is not authenticated
  }
}