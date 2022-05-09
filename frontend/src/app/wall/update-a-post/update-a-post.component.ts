import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faCircleXmark, faImage, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-update-a-post',
  templateUrl: './update-a-post.component.html',
  styleUrls: ['./update-a-post.component.scss']
})
export class UpdateAPostComponent implements OnInit {
  // data sent to the parent component
  @Output() 
  postUpdated: EventEmitter<any> = new EventEmitter<any>();

  // Get all the post information
  @Input() post!: any;

  // Form informations
  updatePostForm!: FormGroup;
  extentionRegEx!: RegExp;
  errorAttachment: boolean = true;  

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;
  returnData!: any;

  // FontAwesome icons
  faImage = faImage;
  faTrashCan = faTrashCan;
  faCircleXmark = faCircleXmark;

  constructor(
    private postsService: PostsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.updatePostForm = this.formBuilder.group({
      title: [this.post.title? this.post.title : null],
      content: [this.post.content? this.post.content : null],
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
      this.infoBox = {'errorMsg' : `La taille de l'image est trop grande`, 'origin': 'updatePost', 'id': this.post.id}
      this.errorAttachment = true;
    // check if the extention is valid
    } else if (file.type.match(this.extentionRegEx)) {
      this.updatePostForm.get('attachment')!.setValue(file);
      this.updatePostForm.updateValueAndValidity();
      const reader = new FileReader();
      this.errorAttachment = false;
      // reader.onload = () => {
      //   this.imagePreview = reader.result as File;
      // };
      reader.readAsDataURL(file);
    // Display an error message if the extention is not valid
    } else {
      this.infoBox = {'errorMsg' : 'Type de fichier invalide', 'origin': 'updatePost', 'id': this.post.id}
      this.errorAttachment = true;
    }
  }

  // Update the post and transmit infos (success or error message) to the parent component
  onUpdatePost() {
    var { title, content } = this.updatePostForm.value;
    const postId = this.post.id;
    var attachment = this.updatePostForm.get('attachment')!.value;

    if (content == this.post.content 
      && title == this.post.title
      && attachment == null
      ) {
        this.postUpdated.emit({
          message : 'post updated', 
          'error': `Aucune modification n'a été effectuée`
        });
    }

    this.postsService.updateAPost(postId, title, content, attachment)
    .subscribe({
      next: (v) => {
        this.returnData = v
        this.infoBox = {'infoMsg' : this.returnData.message, 'origin': 'updatePost', 'id': this.post.id}
      },
      error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'updatePost', 'id': this.post.id},
      complete: () => this.postUpdated.emit({message : 'post updated', title, content, 'attachment': this.returnData.post.attachment, 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg, 'origin': 'updatePost', 'id': this.post.id})
    })
  }

  // Delete the picture attached to the post
  onDelPicture() {
    this.postsService.removePicture(this.post.id)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : Object.values(v), 'origin': 'updatePost', 'id': this.post.id},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message, 'origin': 'updatePost', 'id': this.post.id},
      complete: () =>this.postUpdated.emit({message : 'post updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg, 'origin': 'updatePost', 'id': this.post.id})
    })
  }

  // Delete picture from the selection
  clearAttachmentInput() {
    // get element fileinput by its id
    const fileInput = document.getElementById(`attachment-${this.post.id}`) as HTMLInputElement;
    // reset file input
    fileInput.value = '';

    // clear the value of the form
    this.updatePostForm.get('attachment')!.setValue(null);
    this.updatePostForm.updateValueAndValidity();

    this.errorAttachment = true;
  }

  // On click, sent the signal to the parent component to close the component
  close() {
    this.postUpdated.emit({message : 'close update post'})
  }
}