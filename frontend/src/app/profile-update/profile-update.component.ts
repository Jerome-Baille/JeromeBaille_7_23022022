import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleXmark, faEye, faEyeSlash, faImage, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
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
  emailRegex!: RegExp;
  passwordRegex!: RegExp;
  extentionRegEx!: RegExp;
  errorAttachment: boolean = true;  

  // Info variables (success, error, loading)
  infoBox: any = {};
  newAvatar!: any;
  visiblePassword: boolean = false;
  loading: boolean = true;

  // FontAwesome Icons
  faImage = faImage;
  faTrashCan = faTrashCan;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCircleXmark = faCircleXmark;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loading = true;

    // Set email regex
    this.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Set password regex (min 8 characters, 1 uppercase, 1 lowercase and 1 number)
    this.passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    this.usersForm = this.formBuilder.group({
      username: [this.displayProfile.username? this.displayProfile.username : ''],
      email: [this.displayProfile.email? this.displayProfile.email : '', [Validators.pattern(this.emailRegex)]],
      bio: [this.displayProfile.bio? this.displayProfile.bio : ''],
      avatar: [null],
      password: [null, [Validators.pattern(this.passwordRegex)]]
    });

    const userId = +this.route.snapshot.params['id'];
    this.userProfile$ = this.usersService.getOneUser(userId); 

    this.loading = false;
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
    // Set extention RegEx
    this.extentionRegEx = /png|jpeg|webp|gif/;

    // Check if the size of the file is greater than 5MB
    if (file.size>= 1024*1024*5){
      this.infoBox = {'errorMsg' : `La taille de l'image est trop grande`, 'origin': 'updateProfile', 'id': this.displayProfile.id}
      this.errorAttachment = true;
    // check if the extention is valid
    } else if (file.type.match(this.extentionRegEx)) {
      this.usersForm.get('avatar')!.setValue(file);
      this.usersForm.updateValueAndValidity();
      const reader = new FileReader();
      this.errorAttachment = false;
      // reader.onload = () => {
      //   this.imagePreview = reader.result as File;
      // };
      reader.readAsDataURL(file);
    // Display an error message if the extention is not valid
    } else {
      this.infoBox = {'errorMsg' : 'Type de fichier invalide', 'origin': 'updateProfile', 'id': this.displayProfile.id}
      this.errorAttachment = true;
    }
  }

  // On submit update the user profile or display error message
  onSubmitForm(){
    const userId = this.displayProfile.id;

    var {username, email, bio, password } = this.usersForm.value;
    var avatar = this.usersForm.get('avatar')!.value;

    if (
          username == this.displayProfile.username 
          && email == this.displayProfile.email
          && bio == this.displayProfile.bio
          && password == null
          && avatar == null
        ) {
          this.profileUpdated.emit({
            message : 'profile updated', 
            'errorMsg': `Aucune modification n'a été effectuée`
          })
    } else {
      this.usersService.updateProfile(userId, username, email, bio, avatar)
      .subscribe({
        next: (v) => {
          this.infoBox = {'infoMsg' : Object.values(v)[0], 'origin': 'updateProfile', 'id': this.displayProfile.id}
          this.newAvatar = Object.values(v)[1].avatar
        },
        error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'updateProfile', 'id': this.displayProfile.id},
        complete: () => this.profileUpdated.emit({
          message : 'profile updated', 
          'infoMsg': this.infoBox.infoMsg, 
          'errorMsg': this.infoBox.errorMsg,
          'origin': 'updateProfile', 'id': this.displayProfile.id,
          'username': username,
          'email': email,
          'bio': bio,
          'avatar': this.newAvatar
        }) 
      });
  
      if(this.usersForm.value.password){
        this.usersService.updatePassword(userId, password)
        .subscribe({
          next: (v) => this.infoBox = {'infoMsg' : Object.values(v)[0], 'origin': 'updateProfile', 'id': this.displayProfile.id},
          error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'updateProfile', 'id': this.displayProfile.id},
          complete: () => {
            this.profileUpdated.emit({
            message : 'profile updated', 
            'infoMsg': this.infoBox.infoMsg, 
            'errorMsg': this.infoBox.errorMsg,
            'origin': 'updateProfile', 'id': this.displayProfile.id,
            action : 'logout'
            })
          }
        })
      }
    }
  }

// Delete the user profile picture
  onDelPicture() {
    this.usersService.removePicture(this.displayProfile.id)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : v, 'origin': 'updateProfile', 'id': this.displayProfile.id},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'updateProfile', 'id': this.displayProfile.id},
      complete: () => this.profileUpdated.emit({message : 'profile updated', 'infoMsg': this.infoBox.infoMsg, 'errorMsg': this.infoBox.errorMsg, 'origin': 'updateProfile', 'id': this.displayProfile.id})
    })
  }

  // Show/hide the typed password
  toggleVisibility() {
    this.visiblePassword = !this.visiblePassword;
  }

  clearAttachmentInput() {
    // get element fileinput by its id
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    // reset file input
    fileInput.value = '';

    // clear the value of the form
    this.usersForm.get('avatar')!.setValue(null);
    this.usersForm.updateValueAndValidity();

    this.errorAttachment = true;
  }

  // On click, sent the signal to the parent component to close the component
  close() {
    this.profileUpdated.emit({message : 'close update profile'})
  }
}