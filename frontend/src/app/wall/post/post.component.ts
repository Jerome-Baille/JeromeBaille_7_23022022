import { Component, OnInit, Input } from '@angular/core';
import { Comment, Post } from '../../models/blog.model';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { faTrash, faPenToSquare, faCircleExclamation, faCircleUp, faCircleDown, faComment, faMessage, faEllipsis, faChevronRight, faChevronLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  buttonText!: string;
  isAuth: any = [];
  errorMsg!: string;

  comments!: Comment[];
  loadCreateComment: boolean = false;
  loadEditPost: boolean = false;
  loadComments: boolean = false;

  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCircleExclamation = faCircleExclamation;
  faComment = faComment;
  faMessage = faMessage;
  faEllipsis = faEllipsis;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faThumbsUp = faThumbsUp;

  likelyMe!: any;


  constructor(
    private postsService: PostsService,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.authService.checkIsAuth()
    .subscribe({
      next: (v) => this.isAuth = v,
      error: (e) => this.isAuth = null,
    })
  }

  onDeletePost() {
    this.postsService.deleteAPost(this.post.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload()
    })
  }

  onEditPost() {
    this.router.navigateByUrl(`wall/${this.post.id}/update`);
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

  onCommentView() {
    this.router.navigateByUrl(`wall/${this.post.id}/comment`);
  }

  loadChildComponent(src: string) {
    if (src == "loadEditPost") {
      if (this.loadEditPost == false) {
        this.loadEditPost = true
      } else {
        this.loadEditPost = false
      }
    } else if (src == "loadCreateComment") {
      if (this.loadCreateComment == false) {
        this.loadCreateComment = true
      } else {
        this.loadCreateComment = false
      }
    } else if (src == "loadComments") {
      if (this.loadComments == false) {
        this.loadComments = true
      } else {
        this.loadComments = false
      }
    }
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

  onReportPost() {
    this.postsService.reportAPost(this.post.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => this.router.navigate(['/wall'])
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

  calculateDiff(){
    let createdDate = new Date(this.post.createdAt);
    let currentDate = new Date();
    let timeDiff = currentDate.getTime() - createdDate.getTime();
    let diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
    let diffHours = Math.floor(timeDiff / (1000 * 3600)) - (diffDays * 24);
    let diffMinutes = Math.floor(timeDiff / (1000 * 60)) - (diffDays * 24 * 60) - (diffHours * 60);

    let response = "";
    if (diffDays == 1) {
      response = diffDays + " jour";
    } else if (diffDays > 1) {
      response = diffDays + " jours";
    } else if (diffHours == 1) {
      response = diffHours + " heure";
    } else if (diffHours > 1) {
      response = diffHours + " heures";
    } else if (diffMinutes == 1) {
      response = diffMinutes + " minute";
    } else if (diffMinutes > 1) {
      response = diffMinutes + " minutes";
    } else {
      response = "moins d'une minute";
    }

    return response;
  }
}
