import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/blog.model';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { faChevronLeft, faChevronRight, faCircleDown, faCircleExclamation, faCircleUp, faLeftLong, faLeftRight, faMessage, faPenToSquare, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  posts$!: Observable<Post>;
  post!: Post;
  buttonText!: string;
  errorMsg!: string;
  isAuth: any = [];

  loadEditPost: boolean = false;
  loadCreateComment: boolean = false;
  loadComments: boolean = false;

  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCircleExclamation = faCircleExclamation;
  faLeft = faLeftLong;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faMessage = faMessage;
  faThumbsUp = faThumbsUp;

  constructor(
              private postsService: PostsService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService
              ) {}

  ngOnInit() {
    this.buttonText = 'Oh Snap!';
    const postId = +this.route.snapshot.params['id'];
    this.posts$ = this.postsService.getOnePost(postId); 

    this.posts$.subscribe(post => {
      this.post = post;
    })

    this.authService.checkIsAuth()
    .subscribe({
      next: (v) => this.isAuth = v,
      error: (e) => this.isAuth = null,
    })
  }

  onDeletePost() {
    const postId =  +this.route.snapshot.params['id']
    this.postsService.deleteAPost(postId)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => this.router.navigate(['/wall'])
    })
  }

  onEditPost() {
    const postId = +this.route.snapshot.params['id']
    this.router.navigateByUrl(`wall/${postId}/update`);
  }

  onCommentView() {
    const postId = +this.route.snapshot.params['id']
    this.router.navigateByUrl(`wall/${postId}/comment`);
  }

  loadChildComponent(src: string) {
    if(src == "loadEditPost") {
      if(this.loadEditPost == false){
        this.loadEditPost = true;
      } else {
        this.loadEditPost = false;
      }
    } else if (src == "loadCreateComment") {
      if(this.loadCreateComment == false){
        this.loadCreateComment = true;
      } else {
        this.loadCreateComment = false;
      }
    } else if (src == "loadComments") {
      if(this.loadComments == false){
        this.loadComments = true;
      } else {
        this.loadComments = false;
      }
    }
  }

  onReportPost() {
    this.postsService.reportAPost(this.post.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  onUnreportPost() {
    this.postsService.unreportAPost(this.post.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  findRightUser(likes: any[]) {
    var check = likes.filter(l => l.userId == this.isAuth.userId)
    if (check.length > 0) {
      var isLiked = check.filter(i => i.isLiked == true)
      if (isLiked.length > 0) {
        return 'like'
      } else {
        return 'dislike'
      }
    } else {
      return false
    }
  }

  onLikePost() {
    var postId = this.post.id;
    this.postsService.likeAPost(postId)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  onDislikePost() {
    var postId = this.post.id;
    this.postsService.dislikeAPost(postId)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }
}
