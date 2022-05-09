import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() infoFromPost: any = {};

  @Output() commentListEvent: EventEmitter<any> = new EventEmitter<any>();

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Info variables (loading)
  loading: boolean = true;

  // Main data variables
  comments!: any;
  totalComments!: number;
  postId!: number;

  constructor(
    private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get the main infos (total comments, post id) from the post
    if(this.infoFromPost.tempTotalCom){
      this.totalComments = this.infoFromPost.tempTotalCom;
    } else {
      this.totalComments = this.infoFromPost.totalComments;
    }

    this.postId = this.infoFromPost.postId;
    this.userId = this.infoFromPost.userId;
    this.isAdmin = this.infoFromPost.isAdmin;

    // check if there are comments in the local storage
    var postId = this.postId;
    var storedCom = JSON.parse(localStorage.getItem(`post-${postId}`)!);

    if(storedCom) {
      if (storedCom.NewCom || (new Date() > storedCom.ExpirationDate)) {
        this.loadComs()
      } else {
        this.comments = storedCom.Com;
      }
    } else {
      this.loadComs()
    }

    this.loading = false;
  }

  ngOnChanges() {
    if(this.infoFromPost.newComment) {
      var postId = this.postId;
      var storedCom = JSON.parse(localStorage.getItem(`post-${postId}`)!);

      if(storedCom) {
        if (storedCom.NewCom || (new Date() > storedCom.ExpirationDate)) {
          this.loadComs()
        } else {
          this.comments = storedCom.Com;
        }
      } 
    }    
  }

  // Get 5 reported comments
  loadComs() {
    var postId = this.postId;

    let date = new Date();
    let ExpInTen = date.setMinutes(date.getMinutes() + 10);

    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt,postId';
    var limit = '5';
    var offset = '*';
    var order = 'createdAt:ASC';

    this.commentsService.getPostComments(postId, fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        localStorage.setItem(`post-${postId}`, JSON.stringify({
          'ExpirationDate' : ExpInTen,
          'Com' : v
        }))

        var storedCom = JSON.parse(localStorage.getItem(`post-${postId}`)!);

        this.comments = storedCom.Com

        // Check if there is a new comment (created by current user)
        if(storedCom.NewCom){
          let dataConcatenated = this.comments.concat(storedCom.NewCom);

          localStorage.setItem(`post-${postId}`, JSON.stringify({
            'ExpirationDate': ExpInTen,
            'Com': dataConcatenated
          }));

          var storedCom = JSON.parse(localStorage.getItem(`post-${postId}`)!);

          this.comments = storedCom.Com;
        } 
      },
      error: (e) => console.error(e),
    })
  }

  loadMoreComs() {
    var postId = this.postId;
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt,postId';
    var limit = '5';
    var offset = this.comments.length;
    var order = 'createdAt:ASC';

    this.commentsService.getPostComments(postId,fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        if(v.length != 0) {
          this.comments = this.comments.concat(v);
          console.log('loading more comments')

          // check if there is comments in the local storage
          var storedCom = JSON.parse(localStorage.getItem(`post-${postId}`)!);
          if(storedCom) {
            storedCom.Com = this.comments;
            localStorage.setItem(`post-${postId}`, JSON.stringify(storedCom));
          } 
        } 
      },
      error: (e) => console.error(e),
    })
  }

  triggeredFromChildren(eventData: any) {
    if(eventData.message == 'comment removed') {
      this.commentListEvent.emit(eventData);
      this.comments.length--;
      this.totalComments--;
    } 
  }
}