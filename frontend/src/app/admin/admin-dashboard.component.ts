import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';
import { faHeart, faThumbsDown, faTrash, faPenToSquare, faCrown, faUserGraduate, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @Input() infoFromPost!: any;
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Form variables
  userForm!: FormGroup;
  selected: any = null;
  myUser!: any;

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  // Variables to load child components
  loadEditPost: boolean = false;
  loadEditProfile: boolean = false;

  // Main data
  users: any = [];
  displayProfile: any = [];
  posts: any = [];
  comments : any = [];

  // data sent to the comment-list component
  infoToComment: any = {};

  // data sent to the post-list component
  infoToPost: any = {};

  // FontAwesome icons
  faHeart = faHeart;
  faThumbsDown = faThumbsDown;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCrown = faCrown;
  faUserGraduate = faUserGraduate;
  faUserSlash = faUserSlash;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // remove from local storage all keys starting with post-
    var keys = Object.keys(localStorage).filter(k => k.startsWith('post-'));
    keys.forEach(k => localStorage.removeItem(k));

    localStorage.removeItem('reportedComments')

    // Get current user id and role (admin or not)
    this.authService.checkIsAuth()
    .then((v) => {
        this.isAuth = v
        this.userId = this.isAuth.userId;
        this.isAdmin = this.isAuth.isAdmin;
      })
    .then(() => {
      // Get the 5 more recent reported posts
      this.loadPosts();

      // Get the 5 more recent reported comments
      this.loadComments();

      // Form to select user profile
      this.userForm = this.formBuilder.group({
        users: [null, Validators.required],
      })
    })
    .then(() => this.loading = false)
    .catch((e) => {
        this.isAuth = null
        this.loading = false;
    })
  }

  loadPosts() {
    var fields = 'id,updatedAt';
    var limit = '*';
    var offset = '*';
    var order = 'updatedAt:DESC';

    this.postsService.getReportedPosts(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        this.posts = v

        // Put postId and totalComments in an array
        let totalPosts = this.posts.length;
        this.infoToPost = {totalPosts, 'userId' : this.userId, 'isAdmin' : this.isAdmin};
      },
      error: (e) => console.error(e),
    })
  }

  loadComments() {
    var fields = 'id,updatedAt';
    var limit = '*';
    var offset = '*';
    var order = 'updatedAt:DESC';

    this.commentsService.getReportedComments(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        this.comments = v
        
        // Put postId and totalComments in an array
        let totalComments = this.comments.length;
        this.infoToComment = {totalComments, 'userId' : this.userId, 'isAdmin' : this.isAdmin};
      },
      error: (e) => console.error(e),
    })
  }

  // Form to select user profile
    // Get the selected user id
    valueChange(event: any) {
      this.selected = event.target.value;
    }

    getSelectedUser(e: any) {
      var input = e.target,
          list = input.getAttribute('list'),
          options = document.querySelectorAll('#' + list + ' option'),
          label = input.value;
  
      for(var i = 0; i < options.length; i++) {
          var option = options[i];
  
          if(option.innerHTML == ` ${label} ` ) {
            this.selected = parseInt(option.getAttribute('data-value')!);
            break;
          } else {
            this.selected = null;
          }
      }
   }

   loadUsers(e: any) {
    if(e.target.checked){  
      // Get users information
      this.usersService.getAllUsers()
      .subscribe({
        next: (v) => {
          this.users = v
        },
        error: (e) => {
          console.log(e)
        }
      })
    } else {
      this.displayProfile = [];
    }
  }

  // On submit, get the selected user profile
  onSubmitForm() {
    this.userForm.reset();
    
    if (this.selected === null) {
      this.infoBox = {'errorMsg' : `Aucun utilisateur n'a été trouvé`, 'origin': 'userDashboard', 'id': 1}
      this.displayProfile = [];

    } else {
      var userId = this.selected;
      this.usersService.getOneUser(userId)
      .subscribe({
        next: (v) => this.displayProfile = v,
        error: (e) => {
          this.infoBox = {'errorMsg' : e.error.message, 'origin': 'userDashboard', 'id': 1}
        }
      })
    }
  }

  triggeredFromChildren(eventData: any) {
    switch(eventData.message) {
      case 'comment removed':
        this.comments.length--;
        break;
      case 'post removed':
        this.posts.length--;
        var postId = eventData.id;
        document.getElementById(`post-${postId}`)!.remove();
        break;
    }
  }
}