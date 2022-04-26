import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faPaperclip, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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
  
  // Main data (current post informations and form)
  @Input() post!: any;
  updatePostForm!: FormGroup;

  // Info variables (success, error, loading)
  infoBox: any = {};

  // FontAwesome icons
  faPaperclip = faPaperclip;
  faTrashCan = faTrashCan;

  constructor(
    private postsService: PostsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.updatePostForm = this.formBuilder.group({
      title: [null],
      content: [null],
      attachment: [null]
    })
  }

  // Detects the file selection and sets the value to the form
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.updatePostForm.get('attachment')!.setValue(file);
    this.updatePostForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  // Update the post and transmit infos (success or error message) to the parent component
  onUpdatePost() {
    var { title, content } = this.updatePostForm.value;
    const postId = this.post.id;
    var attachment = this.updatePostForm.get('attachment')!.value;

    this.postsService.updateAPost(postId, title, content, attachment)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : Object.values(v)},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => this.postUpdated.emit({message : 'post updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg})
    })
  }

  // Delete the picture attached to the post
  onDelPicture() {
    this.postsService.removePicture(this.post.id)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : Object.values(v)},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () =>this.postUpdated.emit({message : 'post updated', 'info': this.infoBox.infoMsg, 'error': this.infoBox.errorMsg})
    })
  }
}
