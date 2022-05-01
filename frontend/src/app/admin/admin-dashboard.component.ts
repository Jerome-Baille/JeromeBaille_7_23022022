import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, User, Comment } from 'src/app/models/blog.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';
import { faHeart, faThumbsDown, faTrash, faPenToSquare, faCrown, faUserGraduate, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from 'src/app/services/comments.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
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
  userInfoBox: boolean = false;
  loading: boolean = true;

  // Variables to load child components
  loadEditPost: boolean = false;
  loadEditProfile: boolean = false;

  // Main data
  users$!: Observable<User[]>;
  displayProfile: any = [];
  posts$!: Observable<Post[]>;
  comments$!: Observable<Comment[]>;

  users: any = [];

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
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

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
      // Get all the reported posts
      this.posts$ = this.postsService.getReportedPosts();

      // Get all the reported comments
      this.comments$ = this.commentsService.getReportedComments();

      // Form to select user profile
      this.userForm = this.formBuilder.group({
        users: [null, Validators.required],
      })
    })
    .then(() => this.loading = false)
    .catch((e) => {
        this.isAuth = null
        // this.loading = false;
    })
  }

  // On click, loads/unloads the different child components (edit profile, edit posts)
  loadChildComponent(element: string) {
    if (element === 'editPost') {
        this.loadEditPost = !this.loadEditPost
    } else if (element === 'editProfile') {
      this.loadEditProfile = !this.loadEditProfile
    }
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

    // On submit, get the selected user profile
    onSubmitForm() {
      this.userForm.reset();
      this.userInfoBox = false;
      
      if (this.selected === null) {
        this.userInfoBox = true;
        this.infoBox = {'errorMsg' : `Aucun utilisateur n'a été trouvé`}
        this.displayProfile = [];

      } else {
        var userId = this.selected;
        this.usersService.getOneUser(userId)
        .subscribe({
          next: (v) => this.displayProfile = v,
          error: (e) => {
            this.userInfoBox = true;
            this.infoBox = {'errorMsg' : e.error.message}
          }
        })
      }
    }

  // If the user is not logged in, redirect to the login page
  onToLogin(): void {
    this.router.navigateByUrl('login');
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
          if (e.status === 418) {
            console.log('Teapot is in da place')
          }
        }
      })
    } else {
      this.displayProfile = [];
    }
 }


}
