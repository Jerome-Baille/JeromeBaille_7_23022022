import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, User, Comment } from 'src/app/models/blog.model';
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
  userForm!: FormGroup;
  selected!: number;

  isAuth: any = [];
  loadEditPost: boolean = false;
  loadEditProfile: boolean = false;
  errorMsg!: string;
  msgCount!: number;

  users$!: Observable<User[]>;
  posts$!: Observable<Post[]>;
  comments$!: Observable<Comment[]>;

  displayProfile: any = [];

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
  ) { }

  ngOnInit(): void {
    this.users$ = this.usersService.getAllUsers();

    this.posts$ = this.postsService.getReportedPosts();

    this.comments$ = this.commentsService.getReportedComments();

    this.userForm = this.formBuilder.group({
      users: [null, Validators.required],
    })

    this.authService.checkIsAuth()
      .subscribe({
        next: (v) => this.isAuth = v,
        error: (e) => this.isAuth = null,
      })
  }

  loadChildComponent(element: string) {
    if (element === 'editPost') {
      if (this.loadEditPost == false) {
        this.loadEditPost = true
      } else {
        this.loadEditPost = false
      }
    } else if (element === 'editProfile') {
      if (this.loadEditProfile == false) {
        this.loadEditProfile = true
      } else {
        this.loadEditProfile = false
      }
    }
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }

  onSubmitForm() {
    var userId = this.selected;
    this.usersService.getUserProfile(userId)
    .subscribe({
      next: (v) => this.displayProfile = v,
      error: (e) => console.error(e),
    })
  }
}
