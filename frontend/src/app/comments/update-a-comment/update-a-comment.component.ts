import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleXmark, faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CommentsService } from 'src/app/services/comments.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-update-a-comment',
  templateUrl: './update-a-comment.component.html',
  styleUrls: ['./update-a-comment.component.scss']
})
export class UpdateACommentComponent implements OnInit {
  // data sent to the parent component
  @Output() 
  commentUpdated: EventEmitter<any> = new EventEmitter<any>();

  // Get all the comment informations
  @Input() comment!: any;

  // Form
  updateCommentForm!: FormGroup;

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;
  
  // Updated comment infos
  newContent!: any;
  newAttachment!: any;

  // FontAwesome Icons
  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;
  faCircleXmark = faCircleXmark;

  constructor(
    private route: ActivatedRoute,
    private PostsService: PostsService,
    private CommentsService: CommentsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateCommentForm = this.formBuilder.group({
      content: [this.comment.content? this.comment.content : null],
      attachment: [null]
    })
  }

  // Detects the file selection and sets the value to the form
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.updateCommentForm.get('attachment')!.setValue(file);
    this.updateCommentForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  // Update the comment and transmit infos (success or error message) to the parent component
  onUpdateComment() {
    var { content } = this.updateCommentForm.value;
    const comId = this.comment.id;
    var attachment = this.updateCommentForm.get('attachment')!.value;

    this.CommentsService.updateAComment(comId, content, attachment)
    .subscribe({
      next: (v) => {
        this.infoBox = {'infoMsg' : Object.values(v)[0]};

        this.newAttachment = Object.values(v)[1].attachment
        this.newContent = Object.values(v)[1].content

        // update the comment in the local storage
        var storedCom = JSON.parse(localStorage.getItem(`post-${this.comment.postId}`)!);
        if (storedCom) {
          content ? storedCom.Com.find((com: any) => com.id === comId).content = content : null;
          attachment ? storedCom.Com.find((com: any) => com.id === comId).attachment = this.newAttachment : null;
          localStorage.setItem(`post-${this.comment.postId}`, JSON.stringify(storedCom));
        }

      },
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () =>  this.commentUpdated.emit({message : 'comment updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg, 'content': this.newContent, 'attachment': this.newAttachment}) 
    })
  }

  // Delete the picture attached to the comment
  onDelPicture() {
    this.CommentsService.delCommentPicture(this.comment.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => this.commentUpdated.emit({message : 'comment updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg}) 
    })
  }

  // On click, sent the signal to the parent component to close the component
  close() {
    this.commentUpdated.emit({message : 'close update component'})
  }
}
