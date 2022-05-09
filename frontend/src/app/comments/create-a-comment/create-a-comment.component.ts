import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faCircleXmark, faImage, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CommentsService } from 'src/app/services/comments.service';

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
  extentionRegEx!: RegExp;
  errorAttachment: boolean = true;  

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;
  newComment!: any;


  // FontAwesome Icons
  faImage = faImage;
  faTrashCan = faTrashCan;
  faCircleXmark = faCircleXmark;

  constructor(
    private CommmentsService: CommentsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.commentForm = this.formBuilder.group({
      content: [null],
      attachment: [null]
    })

    this.loading = false;
  }

  // Detects if a file is added by user
  onFileSelected(event: any) {
    const file = event.target.files[0];

    // Set extention RegEx
    this.extentionRegEx = /png|jpeg|webp|gif/;

    // Check if the size of the file is greater than 5MB
    if (file.size>= 1024*1024*5){
      this.infoBox = {'errorMsg' : `La taille de l'image est trop grande`, 'origin': 'createCom', 'id': this.post.id};
      this.errorAttachment = true;
    // check if the extention is valid
    } else if (file.type.match(this.extentionRegEx)) {
      this.commentForm.get('attachment')!.setValue(file);
      this.commentForm.updateValueAndValidity();
      const reader = new FileReader();
      this.errorAttachment = false;
      // reader.onload = () => {
      //   this.imagePreview = reader.result as File;
      // };
      reader.readAsDataURL(file);
    // Display an error message if the extention is not valid
    } else {
      this.infoBox = {'errorMsg' : 'Type de fichier invalide', 'origin': 'createCom', 'id': this.post.id}
      this.errorAttachment = true;
    }
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
            this.newComment = v;
              var storedCom = JSON.parse(localStorage.getItem(`post-${this.post.id}`)!);

              if (storedCom) {
                if(storedCom.NewCom) {
                  localStorage.setItem(`post-${postId}`, JSON.stringify({
                    'NewCom': [storedCom.NewCom, v]
                    }))
                } else {
                  localStorage.setItem(`post-${postId}`, JSON.stringify({
                    'ExpirationDate': storedCom.ExpirationDate,
                    'Com' : [...storedCom.Com, v]
                    }))
                }
              } else {
                localStorage.setItem(`post-${postId}`, JSON.stringify({
                  'NewCom' : v
                  }))
              }
            },
          error: (e) => console.error(e),
        })
      },
      error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'createCom', 'id': this.post.id},
      complete: () => {
        this.comCreated.emit({message : 'create a comment'})
        this.ngOnInit();
      }
    })
  }

  // Delete picture from the selection
  clearAttachmentInput() {
    // get element fileinput by its id
    const fileInput = document.getElementById(`attachment-newComment`) as HTMLInputElement;
    // reset file input
    fileInput.value = '';

    // clear the value of the form
    this.commentForm.get('attachment')!.setValue(null);
    this.commentForm.updateValueAndValidity();

    this.errorAttachment = true;
  }
}
