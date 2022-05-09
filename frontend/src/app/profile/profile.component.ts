import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faLeftLong, faPenToSquare, faTrash, faUserGraduate, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // Get user info on the user Dashboard
  @Input() displayProfile: any = []; 
  
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Variables for the user's posts
  userPosts: any = [];

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  // Variables to load child components
  loadEditProfile: boolean = false;
  loadPosts: boolean = false;

  // FontAwesome icons
  faUserGraduate = faUserGraduate;
  faUserSlash = faUserSlash;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faLeft = faLeftLong;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
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
    .catch((e) => {
        this.isAuth = null
    })

    // Load user's info 
    if(this.displayProfile && this.displayProfile.length== 0){
      const userId = +this.route.snapshot.params['id'];
      this.getUserProfile(userId)
    } else {
      this.loading = false;
    }

    // Remove from local storage all keys starting with "post-" 
    var keys = Object.keys(localStorage).filter(k => k.startsWith('user-'));
    keys.forEach(k => localStorage.removeItem(k));   
  }

  ngOnChanges() {
    this.loadPosts = false;

    if(this.displayProfile && this.displayProfile.length== 0){
      const userId = +this.route.snapshot.params['id'];
      this.usersService.getOneUser(userId)
      .subscribe({
        next: (data)=> this.displayProfile = data,
        error: () => this.displayProfile = null,
      })
    }
  }

  // Get user info
  getUserProfile(userId : number) {
    this.usersService.getOneUser(userId)
    .subscribe({
      next: (data)=> {
        this.displayProfile = data
        this.loading = false;
      },
      error: () => {
        this.displayProfile = null; 
        this.loading = false;
      },
    })
  }

  // Delete user
  deleteProfile(){
    if(confirm(`Voulez-vous vraiment supprimer le compte: ${this.displayProfile.username}?`)){
      this.usersService.deleteProfile(this.displayProfile.id)
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () =>  window.location.href="/"
      })
    }
  }

  // On click, loads/unloads the different child components (edit profile, posts)
  loadChildComponent(element: string) {
    switch(element) {
      case 'editProfile':
        var dropdownCheckBox = document.getElementsByClassName("checkbox");
        // transform dropdown to array
        var dropdownArray = Array.prototype.slice.call(dropdownCheckBox);

        for (var i = 0; i < dropdownArray.length; i++) {
          if(dropdownArray[i].id == `chk-${this.displayProfile.id}`) {
            dropdownArray[i].checked = false;
          }
        }

        this.loadEditProfile = !this.loadEditProfile;
        break;
      case 'loadPosts':
        // The posts are stored in local storage (for 10 minutes or until refresh of the page) to avoid to load them again
        if(this.loadPosts === false) {
          var storedUserPosts = JSON.parse(localStorage.getItem(`user-${this.displayProfile.id}`)!);
  
          if (storedUserPosts) {
            if (new Date() > storedUserPosts.ExpirationDate) {
              this.refreshProfileCom()
            } else {
              this.userPosts = storedUserPosts.Com;
              this.loadPosts = !this.loadPosts;
            }
          } else {
            this.refreshProfileCom()
          }
        } else {
          this.loadPosts = !this.loadPosts;
        }
        break;
      default:
        console.log('Error');
        break;
    }
  }

  // Loads the posts of the user and stores them in local storage for 10 minutes
  refreshProfileCom() {
    let date = new Date();
    let ExpInTen = date.setMinutes(date.getMinutes() + 10);

    this.usersService.getUserPosts(this.displayProfile.id)
    .subscribe({
      next: (v) => {
        localStorage.setItem(`user-${this.displayProfile.id}`, JSON.stringify({
          'Com' : v,
          'ExpirationDate' : ExpInTen
        }));

        var storedUserPosts = JSON.parse(localStorage.getItem(`user-${this.displayProfile.id}`)!);

        this.userPosts = storedUserPosts.Com;
        this.loadPosts = !this.loadPosts;
      },
      error: (e) => console.error(e),
    })
  }

  // Grants admin rights to the user (only available to admins)
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

  // Revokes admin rights to the user (only available to admins)
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

  triggeredFromChildren(eventData: any) {
    if(eventData.message == 'profile updated') {
      this.loadEditProfile = !this.loadEditProfile;
      this.infoBox = {'infoMsg' : eventData.infoMsg, 'errorMsg' : eventData.errorMsg, 'origin': 'profile', 'id': this.displayProfile.id};

      (eventData.username!= null)? this.displayProfile.username = eventData.username : null;
      (eventData.email!= null)? this.displayProfile.email = eventData.email : null;
      (eventData.bio!= null)? this.displayProfile.bio = eventData.bio : null;
      (eventData.avatar!= null)? this.displayProfile.avatar = eventData.avatar : null;

      if(eventData.action == 'logout') {
        this.authService.logout()
        .subscribe({
          next: (v) => console.log(v),
          error: (e) =>  this.infoBox = {'errorMsg' : e.error.message, 'origin': 'profile', 'id': this.displayProfile.id},
          complete: () => window.location.href="/login"  
        })
      }
    } else if (eventData.message == 'close update profile') {
      this.loadEditProfile = !this.loadEditProfile;
    }
  }

  // Redirects the user to the previous page
  goBack(){
    this.location.back();
  }
}