import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() totalComments!: number;

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Info variables (loading)
  loading: boolean = true;

  // Main data variables
  comments!: any;

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get current user id and role (admin or not)
    this.authService.checkIsAuth()
    .then((v) => {
        this.isAuth = v
        this.userId = this.isAuth.userId;
        this.isAdmin = this.isAuth.isAdmin;
      })
    .then(() => {
      // remove from local storage all keys starting with post-
      var keys = Object.keys(localStorage).filter(k => k.startsWith('post-'));
      keys.forEach(k => localStorage.removeItem(k));
    })
    .then(() => {
      // Load 5 first reported comments
      this.loadReportedComs();
      this.loading = false;
    })
    .catch((e) => {
        this.isAuth = null
        this.loading = false;
    })
  }

  // Get 5 reported comments
  loadReportedComs() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
    var limit = '5';
    var offset = '*';
    var order = 'createdAt:DESC';

    this.commentsService.getReportedComments(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        this.comments = v;
      },
      error: (e) => console.error(e),
    })
  }

  loadMoreReportedComs() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
    var limit = '5';
    var offset = this.comments.length;
    var order = 'createdAt:DESC';

    this.commentsService.getReportedComments(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        if(v.length != 0) {
          this.comments = this.comments.concat(v);
          console.log('loading more comments')
          }
      },
      error: (e) => console.error(e),
    })
  }
}
