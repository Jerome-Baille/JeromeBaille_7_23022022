import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronLeft, faChevronRight, faCircleCheck, faCircleDown, faCircleExclamation, faCircleUp, faCircleXmark, faLeftLong, faMessage, faPenToSquare, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { Post } from 'src/app/models/post.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  // data sent to the comment component 
  infoToComment: any = {};

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Main data
  post!: Post;
  comments!: any;

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  // Variables for the comments and points (display changes made by the user without having to reload the page)
  tempLike!: boolean;
  tempDislike!: boolean;
  tempPoints!: number;
  tempTotalCom!: number;

  // Variables to load child components
  loadEditPost: boolean = false;
  loadCreateComment: boolean = false;
  loadComments: boolean = false;

  // FontAwesome icons
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
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location
    ) {}

  ngOnInit() {
    this.loading = true;

    // remove from local storage all keys starting with post-
    var keys = Object.keys(localStorage).filter(k => k.startsWith('post-'));
    keys.forEach(k => localStorage.removeItem(k));
    
    // Get current user id and role (admin or not)
    this.authService.checkIsAuth()
    .then((v) => {
        this.isAuth = v
        this.userId = this.isAuth.userId;
        this.isAdmin = this.isAuth.isAdmin;
      })
    .then(() => {
      // Get the post
      const postId = +this.route.snapshot.params['id'];

      this.postsService.getOnePost(postId)
      .subscribe({
        next: (v) => {
          this.post = v

          // Put postId and totalComments in an array
          let postId = this.post.id;
          let totalComments = this.post.Comments.length;

          this.infoToComment = {postId, totalComments, 'userId' : this.userId, 'isAdmin' : this.isAdmin};
        },
        error: (e) => {
          this.infoBox = {'errorMsg' : e.error.message, 'origin': 'singlePost', 'id': postId}
          this.loading = false;
        },
        complete: () => this.loading = false
      })
    })
    .catch((e) => {
        this.isAuth = null
        this.loading = false;
    })
  }

  // Delete the post and all the comments associated to it
  onDeletePost() {
    if(confirm("Voulez-vous vraiment supprimer ce post ?")) {
      const postId =  +this.route.snapshot.params['id']
      this.postsService.deleteAPost(postId)
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'singlePost', 'id': this.post.id},
        complete: () => this.router.navigate(['/wall'])
      })
    }
  }

  // Load child components (edit post, create comment and comments)
  loadChildComponent(src: string) {
    switch(src) {
      case 'loadEditPost':
        var dropdownCheckBox = document.getElementsByClassName("checkbox");
        // transform dropdown to array
        var dropdownArray = Array.prototype.slice.call(dropdownCheckBox);

        for (var i = 0; i < dropdownArray.length; i++) {
          if(dropdownArray[i].id == `chk-${this.post.id}`) {
            dropdownArray[i].checked = false;
          }
        }

        this.loadEditPost = !this.loadEditPost;
        break;
      case 'loadCreateComment':
        this.loadCreateComment = !this.loadCreateComment;
        break;
      case 'loadComments':
        if(this.loadComments == false) {
          this.loadComments = !this.loadComments;
        } else {
          this.loadComments = !this.loadComments;
        }
        break;
        default:
          console.log('Error');
          break;
    }
  }

  // Report the post to the admin
  onReportPost() {
    this.postsService.reportAPost(this.post.id)
    .subscribe({
      next: (v) =>{
        this.infoBox = {'infoMsg' : Object.values(v), 'origin': 'singlePost', 'id': this.post.id}
        
        this.post.isSignaled = true;
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message, 'origin': 'singlePost', 'id': this.post.id}
      },
      complete: () => this.ngOnInit()
    })
  }

  // Delete the 'reported' status of the post (only available for the admin)
  onUnreportPost() {
    this.postsService.unreportAPost(this.post.id)
    .subscribe({
      next: (v) => {
        this.infoBox = {'infoMsg' : Object.values(v), 'origin': 'singlePost', 'id': this.post.id}
        this.post.isSignaled = false;
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message, 'origin': 'singlePost', 'id': this.post.id}
      },
      complete: () => this.ngOnInit()
    })
  }

  // Check if the user liked/disliked the post
  findRightUser(likes: any[]) {
    var check = likes.filter(l => l.userId == this.userId)
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

  // Like the post
  onLikePost() {
    var postId = this.post.id;
    this.postsService.likeAPost(postId)
    .subscribe({
      next: (v) => {
        let objLike = v;
        let likeCase = "";

        if (Object.values(objLike).find(i => i == "J'aime ce post")) {
          document.getElementById(`like-${postId}`)!.style.color = 'green'
          document.getElementById(`dislike-${postId}`)!.style.color = 'black'
          likeCase = 'like';
         
    
        } else if (Object.values(objLike).find(i => i == "Je supprime mon like")) {
          document.getElementById(`like-${postId}`)!.style.color = 'black'
          document.getElementById(`dislike-${postId}`)!.style.color = 'black'
          likeCase = 'unlike';
    
        } else {
          document.getElementById(`like-${postId}`)!.style.color = 'green'
          document.getElementById(`dislike-${postId}`)!.style.color = 'black'
          likeCase = 'changed to like';
        }

        this.countPoints(likeCase);
      },
      error: (e) => console.error(e),
      complete: () => this.tempLike = !this.tempLike
    })
  }

  // Dislike the post
  onDislikePost() {
    var postId = this.post.id;
    this.postsService.dislikeAPost(postId)
    .subscribe({
      next: (v) => {
        let objDislike = v;
        let dislikeCase = "";

        if (Object.values(objDislike).find(i => i == "Je n'aime pas ce post")) {
          document.getElementById(`like-${postId}`)!.style.color = 'black'
          document.getElementById(`dislike-${postId}`)!.style.color = 'darkred'
          dislikeCase = 'dislike';

        } else if (Object.values(objDislike).find(i => i == "Je supprime mon dislike")) {
          document.getElementById(`like-${postId}`)!.style.color = 'black'
          document.getElementById(`dislike-${postId}`)!.style.color = 'black'
          dislikeCase = 'undislike';

        } else {
          document.getElementById(`like-${postId}`)!.style.color = 'black'
          document.getElementById(`dislike-${postId}`)!.style.color = 'darkred'
          dislikeCase = 'changed to dislike';
        }

        this.countPoints(dislikeCase);
      },
      error: (e) => console.error(e),
      complete: () => this.tempDislike = !this.tempDislike
    })
  }

  // Count the points of the post
  countPoints(userCase : string) {
    if (this.tempPoints == null || undefined) {
      this.tempPoints = this.post.points;
    }

    if (userCase == 'changed to like') {
      this.tempPoints = this.tempPoints + 2;
    } else if (userCase == 'like' || userCase == 'undislike') {
      this.tempPoints = this.tempPoints + 1;
    } else if (userCase == 'unlike' || userCase == 'dislike') {
      this.tempPoints = this.tempPoints - 1;
    } else {
      this.tempPoints = this.tempPoints -2;
    }

    document.getElementById(`points-${this.post.id}`)!.innerHTML = `${this.tempPoints}`
  }


  triggeredFromChildren(eventData: any) {
    if(eventData.message == 'post updated') {
      this.ngOnInit();
      this.loadEditPost = false;
      this.infoBox = {'infoMsg' : eventData.info, 'errorMsg' : eventData.error, 'origin': 'singlePost', 'id': this.post.id}
    } else if (eventData.message == 'create a comment') {
      this.loadCreateComment = false;
      this.loadComments = false;
      this.ngOnInit();
    }

    if (eventData.message == 'close update post') {
      this.loadEditPost = !this.loadEditPost;
    }
  }

  // Redirects the user to the previous page
  goBack(){
    this.location.back();
  }
}