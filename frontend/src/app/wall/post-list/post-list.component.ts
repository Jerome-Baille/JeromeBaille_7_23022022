import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowTrendUp, faCircleXmark, faRocket } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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

  // Info variables (loading)
  loading: boolean = true;

  windowScrolled = false;

  searchText: string = '';
  searchResult!: any;

  // FontAwesome Icons
  faRocket = faRocket;
  faArrowTrendUp = faArrowTrendUp;
  faCircleXmark = faCircleXmark;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router
    ) {}

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
      // Load 5 posts and top posts
      this.loadPosts();
      this.loadTop5();
      this.loading = false;
    })
    .catch((e) => {
        this.isAuth = null
        this.loading = false;
    })

    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
  }

  // Get 5 posts
  loadPosts() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
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
    var fields = 'id,content,attachment,isActive,points,createdAt,updatedAt';
    var limit = '5';
    var offset = '*';
    var order = 'points:DESC';

    this.postsService.getAllPosts(fields, limit, offset, order)
      .subscribe({
        next: (v) => {
          this.topPosts = v;
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
          error: (e) => console.log(e),
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

  clearSearch() {
    this.searchText = '';
  }
}