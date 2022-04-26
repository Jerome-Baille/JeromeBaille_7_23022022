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
    this.userId = this.authService.getUserId();

    if (isNaN(this.userId)) {
      this.authService.checkIsAuth()
      .subscribe({
        next: (v) => {
          this.isAuth = v
          this.userId = this.isAuth.userId;

          this.getUserInfos(this.userId);
        },
        error: (e) => this.isAuth = null,
      })
    }

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
    const file = event.target.files[0];
    this.postForm.get('attachment')!.setValue(file);
    this.postForm.updateValueAndValidity();
    const reader = new FileReader();
    // reader.onload = () => {
    //   this.imagePreview = reader.result as File;
    // };
    reader.readAsDataURL(file);
  }

  // On submit create the post in the database
  onPost() {
    var { title, content } = this.postForm.value;

    this.PostsService.createAPost(title, content, this.postForm.get('attachment')!.value)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => window.location.reload()
    })
  }
}
