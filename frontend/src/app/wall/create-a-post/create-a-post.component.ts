import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { Post, User } from 'src/app/models/blog.model';
import { UsersService } from 'src/app/services/users.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-a-post',
  templateUrl: './create-a-post.component.html',
  styleUrls: ['./create-a-post.component.scss']
})
export class CreateAPostComponent implements OnInit {
  selectedFile!: File;
  imagePreview!: string;

  postForm!: FormGroup;
  errorMsg!: string;

  user!: User;

  faPaperclip = faPaperclip;

  constructor(
    private PostsService: PostsService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: [null],
      content: [null],
      attachment: [null]
    })
  }

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

  onPost() {
    var { title, content } = this.postForm.value;

    this.PostsService.createAPost(title, content, this.postForm.get('attachment')!.value)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload()
    })
  }


}
