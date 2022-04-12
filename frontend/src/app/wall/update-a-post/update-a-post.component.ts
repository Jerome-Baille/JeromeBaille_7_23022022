import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Post } from '../../models/blog.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-update-a-post',
  templateUrl: './update-a-post.component.html',
  styleUrls: ['./update-a-post.component.scss']
})
export class UpdateAPostComponent implements OnInit {
  @Input() post!: any;
  updatePostForm!: FormGroup;
  errorMsg!: string;
  faceSnap$!: Observable<Post>;
  postInfo!: any;

  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;

  constructor(
    private route: ActivatedRoute,
    private PostsService: PostsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updatePostForm = this.formBuilder.group({
      title: [null],
      content: [null],
      attachment: [null]
    })
  }

  onUpdatePost() {
    var { title, content } = this.updatePostForm.value;
    const postId = this.post.id;
    var attachment = this.updatePostForm.get('attachment')!.value;

    this.PostsService.updateAPost(postId, title, content, attachment)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload() 
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.updatePostForm.get('attachment')!.setValue(file);
    this.updatePostForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  onDelPicture() {
    this.PostsService.removePicture(this.post.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => window.location.reload()
    })
  }
}
