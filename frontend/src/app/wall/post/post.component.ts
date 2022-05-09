import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { faTrash, faPenToSquare, faCircleExclamation, faCircleUp, faCircleDown, faComment, faMessage, faEllipsis, faChevronRight, faChevronLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  // Get info from parent component
  @Input() post!: Post;

  @Output() postEmitedData: EventEmitter<any> = new EventEmitter<any>();

  // data sent to the comment component
  infoToComment: any = {};

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  // Main data variables
  comments!: any;

  // Variables to load child components
  loadCreateComment: boolean = false;
  loadEditPost: boolean = false;
  loadComments: boolean = false;

  // Variables for the points (display changes made by the user without having to reload the page)
  tempLike!: boolean;
  tempDislike!: boolean;
  tempPoints!: number;

  // Temp variables to display the right number of comments
  tempTotalCom!: number;
  tempComment: boolean = false;

  // FontAwesome Icons
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


  constructor(
    private postsService: PostsService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.loading = true;

    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.checkIsAdmin();

    // Put postId and totalComments in an array
    let postId = this.post.id;
    let totalComments = this.post.Comments.length;

    this.infoToComment = {postId, totalComments, 'userId': this.userId, 'isAdmin': this.isAdmin};

    this.loading = false;
  }

  // Deletes the post on submit
  onDeletePost() {
    if(confirm("Voulez-vous vraiment supprimer ce post ?")) {
      this.postsService.deleteAPost(this.post.id)
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'post', 'id': this.post.id},
        complete: () => {
          this.postEmitedData.emit({message: 'post removed', id: this.post.id});
          window.location.reload()
        }
      })
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

  // Load child component (edit post, create comment or comments)
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
          this.loadCreateComment = false;
        } else {
          this.loadComments = !this.loadComments;
        }
        break;
      default:
        console.log('Error');
    }
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

  // Report the post
  onReportPost() {
    // we start by closing the menu
    var dropdownCheckBox = document.getElementsByClassName("checkbox");
    // transform dropdown to array
    var dropdownArray = Array.prototype.slice.call(dropdownCheckBox);

    for (var i = 0; i < dropdownArray.length; i++) {
      if(dropdownArray[i].id == `chk-${this.post.id}`) {
        dropdownArray[i].checked = false;
      }
    }

    this.postsService.reportAPost(this.post.id)
    .subscribe({
      next: (v) => {
        this.infoBox = {'infoMsg' : Object.values(v), 'origin': 'post', 'id': this.post.id}
        this.post.isSignaled = true;
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message, 'origin': 'post', 'id': this.post.id}
      },
      complete: () => this.ngOnInit()
    })
  }

  // Delete the 'reported' status of the post (for admins only)
  onUnreportPost() {
    // we start by closing the menu 
    var dropdownCheckBox = document.getElementsByClassName("checkbox");
    // transform dropdown to array
    var dropdownArray = Array.prototype.slice.call(dropdownCheckBox);

    for (var i = 0; i < dropdownArray.length; i++) {
      if(dropdownArray[i].id == `chk-${this.post.id}`) {
        dropdownArray[i].checked = false;
      }
    }
    
    this.postsService.unreportAPost(this.post.id)
    .subscribe({
      next: (v) => {
        this.infoBox = {'infoMsg' : Object.values(v), 'origin': 'post', 'id': this.post.id}
        this.post.isSignaled = false;
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message, 'origin': 'post', 'id': this.post.id}
      },
      complete: () => {
        this.postEmitedData.emit({message: 'post removed', id: this.post.id});
        this.ngOnInit()
      }
    })
  }

  // Calculate the difference between the current date and the date of the post
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

  triggeredFromChildren(eventData: any) {
    switch(eventData.message) {
      case 'post updated':
        this.ngOnInit();
        this.loadEditPost = false;
        this.infoBox = {'infoMsg' : eventData.info, 'errorMsg' : eventData.error, 'origin': 'post', 'id': this.post.id}
        break;
      case 'create a comment':
        this.loadCreateComment = false;

        this.infoToComment = {...this.infoToComment, 'newComment' : eventData}

        if(this.loadComments==true){
          this.loadComments = false;
          setTimeout(() => { this.loadComments = true;}, 50);
        }
        
        if(this.tempTotalCom>= 0) {
          this.tempTotalCom = this.tempTotalCom +1;
        } else {
          this.tempTotalCom = this.post.Comments.length +1;
        }
        break;
      case 'comment removed':
        if(this.tempTotalCom) {
          if(this.tempTotalCom== 1) {
            this.tempTotalCom = this.tempTotalCom -1;
            this.infoToComment = {...this.infoToComment, 'tempTotalCom' : this.tempTotalCom}
            this.loadComments = false;
          } else {
            this.tempTotalCom = this.tempTotalCom -1;
            this.infoToComment = {...this.infoToComment, 'tempTotalCom' : this.tempTotalCom}
          }
        } else {
          if(this.post.Comments.length== 1) {
            this.tempTotalCom = this.post.Comments.length -1;
            this.infoToComment = {...this.infoToComment, 'tempTotalCom' : this.tempTotalCom}
            this.loadComments = false;
          } else {
            this.tempTotalCom = this.post.Comments.length -1;
            this.infoToComment = {...this.infoToComment, 'tempTotalCom' : this.tempTotalCom}
          }

        }
        break;
      case 'close update post':
        this.loadEditPost = !this.loadEditPost;
        break;
    }
  }
}
