import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleXmark, faImage, faPaperclip } from '@fortawesome/free-solid-svg-icons';
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
  errorAttachment: boolean = true;
  imgHelperBoolean: boolean = false;

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  // FontAwesome Icons
  faPaperclip = faPaperclip;
  faImage = faImage;
  faCircleXmark = faCircleXmark;

  constructor(
    private PostsService: PostsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usersService: UsersService
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
        this.loading = false;
    })

    // Set extention RegEx
    this.extentionRegEx = /png|jpeg|webp|gif/;

    this.postForm = this.formBuilder.group({
      title: [null],
      content: [null],
      attachment: [null]
    })

    this.loading = false;
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
    const target = event.target.files[0];

    // Check if the size of the file is greater than 5MB
    if (target.size>= 1024*1024*5){
      this.infoBox = {'errorMsg' : `La taille de l'image est trop grande`, 'origin': 'createPost', 'id': 1}
      this.errorAttachment = true;
    // check if the extention is valid
    } else if (target.type.match(this.extentionRegEx)) {
      this.postForm.get('attachment')!.setValue(target);
      this.postForm.updateValueAndValidity();
      const reader = new FileReader();
      this.errorAttachment = false;
      // reader.onload = () => {
      //   this.imagePreview = reader.result as File;
      // };
      reader.readAsDataURL(target);
    // Display an error message if the extention is not valid
    } else {
      this.infoBox = {'errorMsg' : 'Type de fichier invalide', 'origin': 'createPost', 'id': 1}
      this.errorAttachment = true;
    }
  }

  // On submit create the post in the database
  onPost() {
    var { title, content } = this.postForm.value;
    var attachment = this.postForm.get('attachment')!.value;

    this.PostsService.createAPost(title, content, attachment)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'createPost', 'id': 1},
      complete: () => window.location.reload()
    })
  }

  imgHelper(status: boolean){
    this.imgHelperBoolean = status
  }

  clearAttachmentInput() {
    // get element fileinput by its id
    const fileInput = document.getElementById('attachment') as HTMLInputElement;
    // reset file input
    fileInput.value = '';

    // clear the value of the form
    this.postForm.get('attachment')!.setValue(null);
    this.postForm.updateValueAndValidity();

    this.errorAttachment = true;
  }
}
