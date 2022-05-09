import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {}

// 
// CRUD Comments
//
  // Create
  createAComment(postId: number, content: string, attachment: File) {
    const formData = new FormData();
    if(content!= null) {formData.append('content', content)};
    if(attachment!= null) {formData.append('image', attachment)};

    return this.http.post(`http://localhost:3000/api/comments/new/${postId}`, formData, {withCredentials: true})
  }

  // Read
  getPostComments(postId: number, fields: string, limit: string, offset: any, order: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:3000/api/comments/post/${postId}?fields=${fields}&limit=${limit}&offset=${offset}&order=${order}`, {withCredentials: true});
  }

  getOneComment(commentId: number) {
    return this.http.get<Comment>(`http://localhost:3000/api/comments/${commentId}`, {withCredentials: true});
  }

  getReportedComments(fields: string, limit: string, offset: any, order: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:3000/api/comments/report/all?fields=${fields}&limit=${limit}&offset=${offset}&order=${order}`, {withCredentials: true});
  }

  // Update
  updateAComment(commentId: number, content: string, attachment: File) {
    const formData = new FormData();
    if(content!= null) {formData.append('content', content)};
    if(attachment!= null) {formData.append('image', attachment)};

    return this.http.put(`http://localhost:3000/api/comments/update/${commentId}`, formData, {withCredentials: true})
  }

  // Delete
  deleteAComment(commentId: number) {
    return this.http.delete(`http://localhost:3000/api/comments/del/${commentId}`, {withCredentials: true})
  }

  delCommentPicture(comId: number) {
    return this.http.put(`http://localhost:3000/api/comments/${comId}/picture`, {}, {withCredentials: true})
  }

  // Report a comment
  reportAComment(commentId: number) {
    return this.http.put(`http://localhost:3000/api/comments/report/${commentId}`, {}, {withCredentials: true})
  }

  // Delete Report on comment
  unreportAComment(commentId: number) {
    return this.http.put(`http://localhost:3000/api/comments/unreport/${commentId}`, {}, {withCredentials: true})
  }

  // Like a comment
  likeAComment(commentId: number) {
    return this.http.post(`http://localhost:3000/api/likeComment`, {commentId}, {withCredentials: true})
  }

  // Dislike a comment
  disikeAComment(commentId: number) {
    return this.http.post(`http://localhost:3000/api/dislikeComment`, {commentId}, {withCredentials: true})
  }
}