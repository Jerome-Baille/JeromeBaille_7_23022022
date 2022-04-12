import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/blog.model';
import { AuthService } from 'src/app/services/auth.service';
import { faTrash, faPenToSquare, faCircleExclamation, faChevronLeft, faChevronRight, faCircleDown, faCircleUp, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() c!: any;
  errorMsg!: string;
  loadComponent: boolean = false;
  isAuth: any = [];

  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCircleExclamation = faCircleExclamation;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;
  faThumbsUp = faThumbsUp;

  getComment: any = [];

  constructor(
    private CommentsService : CommentsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.checkIsAuth()
      .subscribe({
        next: (v) => this.isAuth = v,
        error: (e) => this.isAuth = null,
      })

    this.CommentsService.getOneComment(this.c.id)
    .subscribe((comment)=>{
       this.getComment = comment;
    }
    )
  }

  onDeleteComment() {
    this.CommentsService.deleteAComment(this.c.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload()
    })
  }

  loadChildComponent() {
    if (this.loadComponent == false) {
      this.loadComponent = true
    } else {
      this.loadComponent = false
    }
  }

  onReportComment() {
    this.CommentsService.reportAComment(this.c.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload()
    })
  }

  onUnreportComment() {
    this.CommentsService.unreportAComment(this.c.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload()
    })
  }

  onLikeComment() {
    this.CommentsService.likeAComment(this.c.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  onDislikeComment() {
    this.CommentsService.disikeAComment(this.c.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  onCheckIfUserLiked() {
    if (this.c.Likes.includes(this.isAuth.id)) {
      return true
    } else {
      return false
    }
  }

  findRightUser(ComLikes: any[]) {
    var check = ComLikes.filter(l => l.userId == this.isAuth.userId)
    if(check.length > 0) {
      var isLiked = check.filter(i => i.isLiked == true)
      if (isLiked.length > 0){
        return 'like'
      } else {
        return 'dislike'
      }
    } else {
      return false
    }
  }
}
