import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-reported-post-list',
  templateUrl: './reported-post-list.component.html',
  styleUrls: ['./reported-post-list.component.scss']
})
export class ReportedPostListComponent implements OnInit {
  @Input() totalPosts!: number;
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Main data variables
  topPosts!: any;
  posts!: any;

  // Info variables (loading)
  loading: boolean = true;

  windowScrolled = false;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router
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
      // Load 5 first reported posts
      this.loadReportedPosts();
      this.loading = false;
    })
    .catch((e) => {
        this.isAuth = null
        this.loading = false;
    })
  }

  // Get 5 reported posts
  loadReportedPosts() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
    var limit = '5';
    var offset = '*';
    var order = 'createdAt:DESC';

    this.postsService.getReportedPosts(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        this.posts = v;
      },
      error: (e) => console.error(e),
    })
  }


  loadMoreReportedPosts() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
    var limit = '5';
    var offset = this.posts.length;
    var order = 'createdAt:DESC';
    
    this.postsService.getReportedPosts(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        if(v.length != 0) {
        this.posts = this.posts.concat(v);
        console.log('loading more posts')
        }
      },
      error: (e) => console.log(e),
    })
  }
}
