import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { FaceSnap, User } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  errorMessage = '';

  login(email: string, password: string){
    return this.http.post('http://localhost:3000/api/users/login', {email, password}, {withCredentials: true});
  }

    // login(email: string, password: string) {
  //   this.http.post('http://localhost:3000/api/users/login', {email, password})
  //   .subscribe({
  //     next : data => {
  //       console.log(data)
  //   },
  //     error: err => {
  //     console.log('Erreur : ' + err)
  //   }
  //   })
  // }

//   login(email: string, password: string) {
//     return new Promise((resolve, reject) => {
//       this.http.post('http://localhost:3000/api/users/login', {email, password}, { withCredentials: true, observe: 'response' })
//     .pipe(catchError(err => {
//       return of(err);
//     }))
//     .subscribe((response): void => {
//       if (response.status === 200) {
//         console.log(response)
//       } else {
//         const errorMsg = response.error.message
//         console.log(errorMsg);
//       }
//   })
// })
//   }


  register(email: string, username: string, password: string){
    return this.http.post('http://localhost:3000/api/users/register', {email, username, password}, {withCredentials: true});
  }

  logout(){
    return this.http.get('http://localhost:3000/api/users/logout', {withCredentials: true});
  }
}