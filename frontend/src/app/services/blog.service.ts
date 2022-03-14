import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FaceSnap, User } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class FaceSnapsService {

  constructor(private http: HttpClient) {}

  faceSnaps: FaceSnap[] = [];
  faceUsers: User[] = [];
  errorMessage = '';

  getAllFaceSnaps(): Observable<FaceSnap[]> {
    return this.http.get<FaceSnap[]>('http://localhost:3000/api/posts');
  }

  // getAllUsers(): Observable<User[]>{
  //   return this.http.get<User[]>('http://localhost:3000/api/users');
  // }

  getFaceSnapById(faceSnapId: number): Observable<FaceSnap> {
    return this.http.get<FaceSnap>(`http://localhost:3000/api/posts/${faceSnapId}`);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/api/users/${userId}`)
  }

  snapFaceSnapById(faceSnapId: number, snapType: 'snap' | 'unsnap'): void {
      // const faceSnap = this.getFaceSnapById(faceSnapId);
      // snapType === 'snap' ? faceSnap.likes++ : faceSnap.likes--;
  }
}