import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { User } from '../models/blog.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {
  // data sent to the parent component
  @Output() 
  profileUpdated: EventEmitter<any> = new EventEmitter<any>();
  
  // Get profile data
  @Input() displayProfile!: User;


  userProfile$!: Observable<User>;
  getData!: any;

  // Form variables
  usersForm!: FormGroup;

  // Info variables (success, error, loading)
  infoBox: any = {};

  // FontAwesome Icons
  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
      this.usersForm = this.formBuilder.group({
      username: [null],
      email: [null],
      bio: [null],
      avatar: [null],
      password: [null]
    });

    const userId = +this.route.snapshot.params['id'];
    this.userProfile$ = this.usersService.getOneUser(userId); 
  }

  updateProfile(userId: number){
    this.usersService.getOneUser(userId)
    .subscribe((data)=>{
      this.getData = data;
      console.log(this.getData)
    })
  };

  
  // Detects if the user has uploaded a picture
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.usersForm.get('avatar')!.setValue(file);
    this.usersForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  // On submit update the user profile or display error message
  onSubmitForm(){
    const userId = this.displayProfile.id;

    var {username, email, bio, password } = this.usersForm.value;
    var avatar = this.usersForm.get('avatar')!.value;

    this.usersService.updateProfile(userId, username, email, bio, avatar)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : v},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => window.location.reload()  
    });

    if(this.usersForm.value.password){
    this.usersService.updatePassword(userId, password)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : v},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => this.profileUpdated.emit({message : 'post updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg})
    })
    }
  }

// Delete the user profile picture
  onDelPicture() {
    this.usersService.removePicture(this.displayProfile.id)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : v},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => console.info('complete')
    })
  }
}
