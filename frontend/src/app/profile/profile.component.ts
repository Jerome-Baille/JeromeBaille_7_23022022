import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faPenToSquare, faTrash, faUserGraduate, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Post, User } from '../models/blog.model';
import { AuthService } from '../services/auth.service';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() displayProfile: any = []; 

  posts$!: Observable<Post[]>;
  post: any = [];

  userPosts!: any;

  isAuth: any = [];
  loadEditProfile: boolean = false;
  loadPosts: boolean = false;

  faUserGraduate = faUserGraduate;
  faUserSlash = faUserSlash;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    if(this.displayProfile.length== 0){
      const userId = +this.route.snapshot.params['id'];
      this.usersService.getUserProfile(userId)
      .subscribe({
        next: (data)=> this.displayProfile = data,
        error: () => this.displayProfile = null,
      })

      this.posts$ = this.usersService.getUserPosts(userId);
    } else {
      this.posts$ = this.usersService.getUserPosts(this.displayProfile.id);
    }

    this.authService.checkIsAuth()
    .subscribe({
      next: (v) => this.isAuth = v,
      error: (e) => this.isAuth = null,
    })

    this.nbPosts();
  }

  ngOnChanges() {
    if(this.displayProfile.length== 0){
      const userId = +this.route.snapshot.params['id'];
      this.usersService.getUserProfile(userId)
      .subscribe({
        next: (data)=> this.displayProfile = data,
        error: () => this.displayProfile = null,
      })

      this.posts$ = this.usersService.getUserPosts(userId);
    } else {
      this.posts$ = this.usersService.getUserPosts(this.displayProfile.id);
    }

    this.nbPosts();
  }

  nbPosts() {
    this.posts$.subscribe({
      next: (v) => this.post = v,
      error: (e) => this.post = e,
    })
    
  }

  goToUpdate(){
    this.router.navigateByUrl(`profile/${this.displayProfile.id}`);
  }

  deleteProfile(){
    this.usersService.deleteProfile(this.displayProfile.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  loadChildComponent(element: string) {
    if (element === 'editProfile') {
      this.loadEditProfile = !this.loadEditProfile;
    } else if (element === 'loadPosts') {
      this.loadPosts = !this.loadPosts;
    }
  }

  onToLogin(): void {
    this.router.navigateByUrl('login');
  }

  onGrant() {
    var userId = this.displayProfile.id;
    const isAdmin = true;
    this.usersService.grantAdmin(userId, isAdmin)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }

  onRevoke() {
    var userId = this.displayProfile.id;
    const isAdmin = false;
    this.usersService.revokeAdmin(userId, isAdmin)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }
}
