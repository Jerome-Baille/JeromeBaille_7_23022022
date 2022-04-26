import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-a-comment',
  templateUrl: './create-a-comment.component.html',
  styleUrls: ['./create-a-comment.component.scss']
})
export class CreateACommentComponent implements OnInit {
  // Infos sent to the parent component
  @Output() 
  comCreated: EventEmitter<any> = new EventEmitter<any>();

  // Get post infos from parent component
  @Input() post!: any;

  // Form variables
  commentForm!: FormGroup;
  newComment!: any;

  // Info variables (success, error, loading)
  infoBox: any = {};

  // FontAwesome Icons
  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;

  constructor(
    private PostsService: PostsService,
    private CommmentsService: CommentsService,
    private authService: AuthService,
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

  // Detects if a file is added by user
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.commentForm.get('attachment')!.setValue(file);
    this.commentForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  // On submit add a new comment to the database (and store it in the local storage)
  onComment() {
    var { content } = this.commentForm.value;
    const postId = this.post.id;
    var attachment = this.commentForm.get('attachment')!.value;

    this.CommmentsService.createAComment(postId, content, attachment)
    .subscribe({
      next: (v) => { 
        this.newComment = v;
        this.CommmentsService.getOneComment(this.newComment.id)
        .subscribe({
          next: (v) => {
            var storedCom = JSON.parse(localStorage.getItem(`post-${this.post.id}`)!);

            if (storedCom) {
              storedCom.Com.unshift(v);
              localStorage.setItem(`post-${this.post.id}`, JSON.stringify(storedCom));
            } else {
              localStorage.setItem(`post-${postId}`, JSON.stringify({
                'NewCom' : v
                }))
            }
          },
          error: (e) => console.error(e),
        })
      },
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => this.comCreated.emit({message : 'create a comment'})
    })
  }
}
