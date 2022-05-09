import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faCircleXmark, faImage, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CommentsService } from 'src/app/services/comments.service';

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
  extentionRegEx!: RegExp;
  errorAttachment: boolean = true;  

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;
  
  // Updated comment infos
  newContent!: any;
  newAttachment!: any;

  // FontAwesome Icons
  faImage = faImage;
  faTrashCan = faTrashCan;
  faCircleXmark = faCircleXmark;

  constructor(
    private CommentsService: CommentsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.updateCommentForm = this.formBuilder.group({
      content: [this.comment.content? this.comment.content : null],
      attachment: [null]
    })

    this.loading = false;
  }

  // Detects the file selection and sets the value to the form
  onFileSelected(event: any) {
    const file = event.target.files[0];

    // Set extention RegEx
    this.extentionRegEx = /png|jpeg|webp|gif/;

    // Check if the size of the file is greater than 5MB
    if (file.size>= 1024*1024*5){
      this.infoBox = {'errorMsg' : `La taille de l'image est trop grande`, 'origin': 'updateCom', 'id': this.comment.id}
      this.errorAttachment = true;
    // check if the extention is valid
    } else if (file.type.match(this.extentionRegEx)) {
      this.updateCommentForm.get('attachment')!.setValue(file);
      this.updateCommentForm.updateValueAndValidity();
      const reader = new FileReader();
      this.errorAttachment = false;
      // reader.onload = () => {
      //   this.imagePreview = reader.result as File;
      // };
      reader.readAsDataURL(file);
    // Display an error message if the extention is not valid
    } else {
      this.infoBox = {'errorMsg' : 'Type de fichier invalide', 'origin': 'updateCom', 'id': this.comment.id}
      this.errorAttachment = true;
    }
  }

  // Update the comment and transmit infos (success or error message) to the parent component
  onUpdateComment() {
    var { content } = this.updateCommentForm.value;
    const comId = this.comment.id;
    var attachment = this.updateCommentForm.get('attachment')!.value;

    if (content == this.comment.content && attachment == null) {
      this.commentUpdated.emit({
        message : 'comment updated', 
        'error': `Aucune modification n'a été effectuée`
      })
    } else {
      this.CommentsService.updateAComment(comId, content, attachment)
      .subscribe({
        next: (v) => {
          this.infoBox = {'infoMsg' : Object.values(v)[0], 'origin': 'updateCom', 'id': this.comment.id};
  
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
        error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'updateCom', 'id': this.comment.id},
        complete: () =>  this.commentUpdated.emit({message : 'comment updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg, 'origin': 'updateCom', 'id': this.comment.id, 'content': this.newContent, 'attachment': this.newAttachment}) 
      })
    }
  }

  // Delete the picture attached to the comment
  onDelPicture() {
    this.CommentsService.delCommentPicture(this.comment.id)
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => this.commentUpdated.emit({message : 'comment updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg, 'origin': 'updateCom', 'id': this.comment.id}) 
    })
  }

  // Delete picture from the selection
  clearAttachmentInput() {
    // get element fileinput by its id
    const fileInput = document.getElementById(`attachment-${this.comment.id}`) as HTMLInputElement;
    // reset file input
    fileInput.value = '';

    // clear the value of the form
    this.updateCommentForm.get('attachment')!.setValue(null);
    this.updateCommentForm.updateValueAndValidity();

    this.errorAttachment = true;
  }

  // On click, sent the signal to the parent component to close the component
  close() {
    this.commentUpdated.emit({message : 'close update component'})
  }
}
