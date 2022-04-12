import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) {}

  // 
  //  CRUD Post
  //
  // Create
  createAPost(title: string, content: string, attachment: File) {
    const formData = new FormData();
    if(title!= null){formData.append('title', title)};
    if(content!= null){formData.append('content', content)};
    if(attachment!= null){formData.append('image', attachment)}
    return this.http.post('http://localhost:3000/api/posts/', formData, {withCredentials: true})
  }

  // Read
  getOnePost(postId: number): Observable<Post> {
    return this.http.get<Post>(`http://localhost:3000/api/posts/${postId}`, {withCredentials: true});
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:3000/api/posts', {withCredentials: true});
  }

  getReportedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:3000/api/posts/report/all', {withCredentials: true});
  }

  // Update
  updateAPost(postId: number, title: string, content: string, attachment: File) {
      const formData = new FormData();
      if(title!= null) {formData.append('title', title)};
      if(content!= null) {formData.append('content', content)};
      if(attachment!= null) {formData.append('image', attachment)};
      return this.http.put(`http://localhost:3000/api/posts/${postId}`, formData, {withCredentials: true})
  }

  removePicture(postId: number) {
    return this.http.put(`http://localhost:3000/api/posts/${postId}/picture`, {}, {withCredentials: true})
  }

  // Report a post
  reportAPost(postId: number) {
    return this.http.put(`http://localhost:3000/api/posts/report/${postId}`, {}, {withCredentials: true})
  }

  // delete Report on post
  unreportAPost(postId: number) {
    return this.http.put(`http://localhost:3000/api/posts/unreport/${postId}`, {}, {withCredentials: true})
  }

  // Delete
  deleteAPost(postId: number) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`, {withCredentials: true})
  }

// Like or Dislike a post 
  likeAPost(postId: number) {
    return this.http.post(`http://localhost:3000/api/like`, {postId}, {withCredentials: true})
  }

  dislikeAPost(postId: number) {
    return this.http.post(`http://localhost:3000/api/dislike`, {postId}, {withCredentials: true})
  }
}