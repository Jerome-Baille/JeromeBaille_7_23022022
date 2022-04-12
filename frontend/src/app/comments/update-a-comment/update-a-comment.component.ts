import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CommentsService } from 'src/app/services/comments.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-update-a-comment',
  templateUrl: './update-a-comment.component.html',
  styleUrls: ['./update-a-comment.component.scss']
})
export class UpdateACommentComponent implements OnInit {
  @Input() c!: any;
  updateCommentForm!: FormGroup;
  errorMsg!: string;
  
  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;

  constructor(
    private route: ActivatedRoute,
    private PostsService: PostsService,
    private CommentsService: CommentsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateCommentForm = this.formBuilder.group({
      content: [null],
      attachment: [null]
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.updateCommentForm.get('attachment')!.setValue(file);
    this.updateCommentForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  onUpdateComment() {
    var { content } = this.updateCommentForm.value;
    const comId = this.c.id;
    var attachment = this.updateCommentForm.get('attachment')!.value;

    this.CommentsService.updateAComment(comId, content, attachment)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => this.errorMsg = e.error.message,
      complete: () => window.location.reload() 
    })
  }

  onDelPicture() {
    this.CommentsService.delCommentPicture(this.c.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => location.reload()
    })
  }
}
