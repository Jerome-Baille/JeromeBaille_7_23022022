import { Component, OnInit } from '@angular/core';
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
  posts$!: Observable<Post[]>;

  post!: Post;

  postsSorted$!: Observable<Post[]>;
  isAuth: any = [];
  windowScrolled = false;

  faRocket = faRocket;
  faArrowTrendUp = faArrowTrendUp;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });

    this.posts$ = this.postsService.getAllPosts();

    this.authService.headerCheckIsAuth()
      .subscribe({
        next: (v) => this.isAuth = v,
        error: () => this.isAuth = null,
      })

    this.postsSorted$ = this.posts$
      .pipe(
        map(posts => 
          posts.sort((a, b) => b.points - a.points)
          )
      )
  }

  onToLogin(): void {
    this.router.navigateByUrl('login');
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}