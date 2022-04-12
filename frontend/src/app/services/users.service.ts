import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, User } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

//
// CRUD User
//

  // Create
    // User creation is managed by auth.service.ts

  // Read
  getUserProfile(userId : number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/api/users/${userId}`, {withCredentials: true});
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/users/', {withCredentials: true})
  }

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`http://localhost:3000/api/users/userPosts/${userId}`, {withCredentials: true});
  }


  // Update
  updateProfile(userId: number, username: string, email: string, bio: string, avatar: File) {
    const formData = new FormData();
    if (username!= null)  {formData.append('username', username);}
    if (email != null)    {formData.append('email', email)}
    if (bio != null)      {formData.append('bio', bio)}
    if (avatar != null)   {formData.append('image', avatar)}
    return this.http.put(`http://localhost:3000/api/users/${userId}`, formData, {withCredentials: true}) 
  }

  updatePassword(userId: number, password: string) {
    return this.http.put(`http://localhost:3000/api/users/${userId}/password`, {password}, {withCredentials: true});
  }

  // Delete
  deleteProfile(userId: number){
    return this.http.delete(`http://localhost:3000/api/users/${userId}`, {withCredentials: true});
  }

  removePicture(userId: number) {
    return this.http.put(`http://localhost:3000/api/users/${userId}/picture`, {}, {withCredentials: true})
  }


  // Admin permissions 
  grantAdmin(id: number, isAdmin: boolean) {
    return this.http.put(`http://localhost:3000/api/users/${id}/grant`, {isAdmin}, {withCredentials: true});
  }

  revokeAdmin(id: number, isAdmin: boolean) {
    return this.http.put(`http://localhost:3000/api/users/${id}/revoke`, {isAdmin}, {withCredentials: true});
  }
}