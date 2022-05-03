import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { Post, User } from 'src/app/models/blog.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-a-post',
  templateUrl: './create-a-post.component.html',
  styleUrls: ['./create-a-post.component.scss']
})
export class CreateAPostComponent implements OnInit {
  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Main data
  user: any = [];

  // Form variables
  selectedFile!: File;
  postForm!: FormGroup;
  extentionRegEx!: RegExp;
  errorType: boolean = false;

  // Info variables (success, error, loading)
  infoBox: any = {};

  // FontAwesome Icons
  faPaperclip = faPaperclip;

  constructor(
    private PostsService: PostsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
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

    // Set extention RegEx
    this.extentionRegEx = /^png|jpe?g|webp|gif$/;

    this.postForm = this.formBuilder.group({
      title: [null],
      content: [null],
      attachment: [null]
    })
  }

  // Get current user infos
  getUserInfos(userId: number) {
    this.usersService.getOneUser(userId)
    .subscribe({
      next: (v) => this.user = v,
      error: (e) => console.log(e)
    })
  }

  // Detects if the user has selected a file
  onFileSelected(event: any) {
    // check if the extention is valid
    if (event.target.files[0].type.match(this.extentionRegEx)) {
      const file = event.target.files[0];
      this.postForm.get('attachment')!.setValue(file);
      this.postForm.updateValueAndValidity();
      const reader = new FileReader();
      // reader.onload = () => {
      //   this.imagePreview = reader.result as File;
      // };
      reader.readAsDataURL(file);
    } else {
      this.infoBox = {'errorMsg' : 'Type de fichier invalide'}
      this.errorType = true;
    }
  }

  // On submit create the post in the database
  onPost() {
    var { title, content } = this.postForm.value;
    var attachment = this.postForm.get('attachment')!.value;

    if(this.errorType = true){
      window.location.reload();
    }

    this.PostsService.createAPost(title, content, attachment)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => window.location.reload()
    })
  }
}
