import { Component, Input, OnInit } from '@angular/core';
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
  @Input() displayProfile!: User;
  userProfile$!: Observable<User>;
  getData!: any;
  usersForm!: FormGroup;
  responseMsg: any = [];
  errorMsg: any = [];

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
    this.userProfile$ = this.usersService.getUserProfile(userId); 
  }

  updateProfile(userId: number){
    this.usersService.getUserProfile(userId)
    .subscribe((data)=>{
      this.getData = data;
      console.log(this.getData)
    })
  };

  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.usersForm.get('avatar')!.setValue(file);
    this.usersForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  onSubmitForm(){
    const userId = this.displayProfile.id;

    var {username, email, bio, password } = this.usersForm.value;
    var avatar = this.usersForm.get('avatar')!.value;

    this.usersService.updateProfile(userId, username, email, bio, avatar)
    .subscribe({
      next: (v) => this.responseMsg = v,
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload()  
    });

    if(this.usersForm.value.password){
    this.usersService.updatePassword(userId, password)
    .subscribe({
      next: (v) => this.responseMsg = v,
      error: (e) => this.errorMsg = e.error.message,
      complete: () => console.info('complete')
    })
    }
  }


  onDelPicture() {
    this.usersService.removePicture(this.displayProfile.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }
}
