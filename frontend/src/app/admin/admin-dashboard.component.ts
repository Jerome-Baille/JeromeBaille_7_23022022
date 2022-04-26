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
  selected!: number;

  // Info variables (success, error, loading)
  errorMsg: string = "";
  infoMsg: any = "";
  loading: boolean = true;

  // Variables to load child components
  loadEditPost: boolean = false;
  loadEditProfile: boolean = false;

  // Main data
  users$!: Observable<User[]>;
  displayProfile: any = [];
  posts$!: Observable<Post[]>;
  comments$!: Observable<Comment[]>;

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

    // Get users information
    this.users$ = this.usersService.getAllUsers();

    // Get all the reported posts
    this.posts$ = this.postsService.getReportedPosts();

    // Get all the reported comments
    this.comments$ = this.commentsService.getReportedComments();

    // Form to select user profile
    this.userForm = this.formBuilder.group({
      users: [null, Validators.required],
    })

    this.loading = false;
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

    // On submit, get the selected user profile
    onSubmitForm() {
      var userId = this.selected;
      this.usersService.getOneUser(userId)
      .subscribe({
        next: (v) => this.displayProfile = v,
        error: (e) => console.error(e)
      })
    }

  // If the user is not logged in, redirect to the login page
  onToLogin(): void {
    this.router.navigateByUrl('login');
  }
}
