import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowTrendUp, faRocket } from '@fortawesome/free-solid-svg-icons';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from '../../models/blog.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Main data variables
  topPosts!: any;
  posts!: any;
  loadedPosts: number = 0;

  windowScrolled = false;

  // FontAwesome Icons
  faRocket = faRocket;
  faArrowTrendUp = faArrowTrendUp;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    // Get current user id and role (admin or not)
    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.checkIsAdmin();

    if (isNaN(this.userId)) {
      this.authService.checkIsAuth()
      .subscribe({
        next: (v) => {
          this.isAuth = v
          this.userId = this.isAuth.userId;
          this.isAdmin = this.isAuth.isAdmin;  
        },
        error: (e) => this.isAuth = null,
      })
    }

    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });

    // remove from local storage all keys starting with post-
    var keys = Object.keys(localStorage).filter(k => k.startsWith('post-'));
    keys.forEach(k => localStorage.removeItem(k));

    // Load 5 posts and top posts
    this.loadPosts();
    this.loadTop5();
  }

  // Get 5 posts
  loadPosts() {
    var fields = 'id,content,attachment,isActive,points,createdAt,updatedAt';
    var limit = '5';
    var offset = '*';
    var order = 'createdAt:DESC';

    this.postsService.getAllPosts(fields, limit, offset, order)
      .subscribe({
        next: (v) => {
          this.posts = v;
        },
        error: (e) => console.error(e),
      })
  }

  // Get the 5 most liked posts
  loadTop5() {
    var fields = '*';
    var limit = '*';
    var offset = '*';
    var order = '*';

    this.postsService.getAllPosts(fields, limit, offset, order)
      .pipe(
        map(posts => 
          posts.sort((a, b) => b.points - a.points)
          )
      )
      .subscribe({
        next: (v) => {
          this.topPosts = v.slice(0, 5)
        },
        error: (e) => console.error(e),
      })
  }


  // Load more posts when scrolling down
  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      var fields = 'id,content,attachment,isActive,points,createdAt,updatedAt';
      var limit = '5';
      var offset = this.posts.length;
      var order = 'createdAt:DESC';
  
      this.postsService.getAllPosts(fields, limit, offset, order)
        .subscribe({
          next: (v) => {
            if(v.length != 0) {
            this.posts = this.posts.concat(v);
            console.log('loading more posts')
            }
          },
          error: (e) => console.error(e),
        })
    }
  }

// Redirect to login page
  onToLogin(): void {
    this.router.navigateByUrl('login');
  }

  // Scroll to the top of the page on click
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}