import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CommentsService } from 'src/app/services/comments.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-a-comment',
  templateUrl: './create-a-comment.component.html',
  styleUrls: ['./create-a-comment.component.scss']
})
export class CreateACommentComponent implements OnInit {
  @Input() post!: any;
  commentForm!: FormGroup;
  errorMsg!: string;

  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;

  constructor(
    private PostsService: PostsService,
    private CommmentsService: CommentsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: [null],
      attachment: [null]
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.commentForm.get('attachment')!.setValue(file);
    this.commentForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  onComment() {
    // const { content, attachment } = this.commentForm.value;
    // const postId = this.post.id;
    // const postId = +this.route.snapshot.params['id'];
    // this.faceSnapsService.createAComment(postId, content, attachment)
    // .subscribe({
    //   next: (v) => console.log(v),
    //   error: (e) => this.errorMsg = e.error.message,
    //   complete: () => window.location.reload()  
    // })

    var { content } = this.commentForm.value;
    const postId = this.post.id;
    var attachment = this.commentForm.get('attachment')!.value;

    this.CommmentsService.createAComment(postId, content, this.commentForm.get('attachment')!.value)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload() 
    })
  }
}
