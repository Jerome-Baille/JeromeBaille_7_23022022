import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/blog.model';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronLeft, faChevronRight, faCircleCheck, faCircleDown, faCircleExclamation, faCircleUp, faCircleXmark, faLeftLong, faMessage, faPenToSquare, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
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
    private commentsService: CommentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.loading = true;
    
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
    
    const postId = +this.route.snapshot.params['id'];

    this.postsService.getOnePost(postId)
    .subscribe({
      next: (v) => this.post = v,
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => this.loading = false
    })
  }

  // Delete the post and all the comments associated to it
  onDeletePost() {
    if(confirm("Voulez-vous vraiment supprimer ce post ?")) {
      const postId =  +this.route.snapshot.params['id']
      this.postsService.deleteAPost(postId)
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => this.infoBox = {'errorMsg' : e.error.message},
        complete: () => this.router.navigate(['/wall'])
      })
    }
  }

  // Load child components (edit post, create comment and comments)
  loadChildComponent(src: string) {
    if(src == "loadEditPost") {
      this.loadEditPost = !this.loadEditPost;
    } else if (src == "loadCreateComment") {
      this.loadCreateComment = !this.loadCreateComment;
      this.loadComments = false;
    } else if (src == "loadComments") {
      if(this.loadComments == false) {
        this.loadComments = !this.loadComments;

        var storedCom = JSON.parse(localStorage.getItem(`post-${this.post.id}`)!);

        let date = new Date();
        let ExpInTen = date.setMinutes(date.getMinutes() + 10);

        // First, check if there is any comments in the local storage
        if (storedCom) {
          // Check if there is a new comment (created by current user)
          if(storedCom.NewCom){
            this.loadPostComments()

            let dataConcatenated = this.comments.concat(storedCom.NewCom);

            localStorage.setItem(`post-${this.post.id}`, JSON.stringify({
              'ExpirationDate': ExpInTen,
              'Com': dataConcatenated
            }));

            var storedCom = JSON.parse(localStorage.getItem(`post-${this.post.id}`)!);

            this.comments = storedCom.Com;
          } else {
            // Check if the comments have reached the expiration date and need to be refreshed
            if (new Date() > storedCom.ExpirationDate) {
              this.loadPostComments()
            } else {
              this.comments = storedCom.Com;
            }
          }
        } else {
          this.loadPostComments();
        }
      } else {
        this.loadComments = !this.loadComments;
      }
    }
  }

  // Load the comments of the post
  loadPostComments() {
    let date = new Date();
    let ExpInTen = date.setMinutes(date.getMinutes() + 10);

    this.commentsService.getPostComments(this.post.id)
    .subscribe({
      next: (v) => {
        localStorage.setItem(`post-${this.post.id}`, JSON.stringify({
          'ExpirationDate' : ExpInTen,
          'Com' : v
        }))

        var storedCom = JSON.parse(localStorage.getItem(`post-${this.post.id}`)!);
        this.comments = storedCom.Com
      },
      error: (e) => console.error(e),
    })
  }


  // Report the post to the admin
  onReportPost() {
    this.postsService.reportAPost(this.post.id)
    .subscribe({
      next: (v) =>{
        this.infoBox = {'infoMsg' : Object.values(v)}
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message}
      },
      complete: () => this.ngOnInit()
    })
  }

  // Delete the 'reported' status of the post (only available for the admin)
  onUnreportPost() {
    this.postsService.unreportAPost(this.post.id)
    .subscribe({
      next: (v) => {
        this.infoBox = {'infoMsg' : Object.values(v)}
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message}
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

  triggeredFromCreateComment(eventData: any) {
    this.loadCreateComment = false;

    this.loadComments = false;

    this.ngOnInit();
  }

  triggeredFromComment(eventData: any) {
    this.ngOnInit();
  }

  triggeredFromChildren(eventData: any) {
    if(eventData.message == 'post updated') {
      this.ngOnInit();
      this.infoBox = {'infoMsg' : eventData.info, 'errorMsg' : eventData.error}
    }
  }
}