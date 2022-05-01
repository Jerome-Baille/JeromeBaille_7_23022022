import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { faTrash, faPenToSquare, faCircleExclamation, faCircleDown, faCircleUp, faThumbsUp, faCircleCheck, faCircleXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  // Info sent to the parent component
  @Output() 
  dataEmited: EventEmitter<string> = new EventEmitter<string>();

  // Get all comments of a post from parent component
  @Input() com!: any;

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;
  isAuth: any = [];

  // Info variables (success, error, loading)
  infoBox: any = {};
  loading: boolean = true;

  // Variables to load child components
  loadUpdateComment: boolean = false;

  // Variables for the points (display changes made by the user without having to reload the page)
  tempLike!: boolean;
  tempDislike!: boolean;
  tempPoints!: number;

  // FontAwesome Icons
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCircleExclamation = faCircleExclamation;
  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;
  faThumbsUp = faThumbsUp;
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;
  faCircleEllipsisVertical = faEllipsisVertical;

  constructor(
    private CommentsService : CommentsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.checkIsAdmin();

    this.loading = false;
  }

  // Delete the comment from the database and the local storage
  onDeleteComment() {
    this.CommentsService.deleteAComment(this.com.id)
    .subscribe({
      next: (v) => this.infoBox = {'infoMsg' : Object.values(v)},
      error: (e) => this.infoBox = {'errorMsg' : e.error.message},
      complete: () => {
        // Remove the comment from the local storage
        var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
        var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);
        var index = storedCom.Com.indexOf(comFound);
        storedCom.Com.splice(index, 1);

        localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))

        document.getElementById(`com-${this.com.id}`)!.remove();

        this.dataEmited.emit()
      }
    })
  }

  // Load the update comment component
  loadChildComponent() {
    this.ngOnInit();
    this.loadUpdateComment = !this.loadUpdateComment;
  }

  // Report the comment to the admin
  onReportComment() {
    this.CommentsService.reportAComment(this.com.id)
    .subscribe({
      next: (v) =>{
        this.infoBox = {'infoMsg' : Object.values(v)}

        // Change the value in the local storage
        var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
        var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);

        comFound.isSignaled = true;

        localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))

        this.com.isSignaled = true;
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message}
        this.ngOnInit()
      },
      complete: () => {
        this.ngOnInit()
      }
    })
  }

  // Delete the 'reported' status of the comment (only available for the admin)
  onUnreportComment() {
    this.CommentsService.unreportAComment(this.com.id)
    .subscribe({
      next: (v) => {
        this.infoBox = {'infoMsg' : Object.values(v)}

        // Change the value in the local storage
        var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
        var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);

        comFound.isSignaled = false;

        localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))

        this.com.isSignaled = false;
      },
      error: (e) => {
        this.infoBox = {'errorMsg' : e.error.message}
        this.ngOnInit()
      },
      complete: () => this.ngOnInit()
    })
  }

  // Like the comment and update the local storage
  onLikeComment() {
    var comId = this.com.id
    this.CommentsService.likeAComment(comId)
    .subscribe({
      next: (v) => {
        let objLikeCom = v;
        let likeComCase = "";

        if (Object.values(objLikeCom).find(i => i == "J'aime ce commentaire")) {
          document.getElementById(`likeCom-${comId}`)!.style.color = 'green'
          document.getElementById(`dislikeCom-${comId}`)!.style.color = 'black'
          likeComCase = 'like';
         
    
        } else if (Object.values(objLikeCom).find(i => i == "Je supprime mon like")) {
          document.getElementById(`likeCom-${comId}`)!.style.color = 'black'
          document.getElementById(`dislikeCom-${comId}`)!.style.color = 'black'
          likeComCase = 'unlike';
    
        } else {
          document.getElementById(`likeCom-${comId}`)!.style.color = 'green'
          document.getElementById(`dislikeCom-${comId}`)!.style.color = 'black'
          likeComCase = 'changed to like';
        }

        let likeBody = Object.values(objLikeCom)[1]

        if (likeBody != undefined) {
          var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
          var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);
  
          comFound.ComLikes = [likeBody]
          
          localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))
        } else {
          var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
          var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);
  
          comFound.ComLikes = []
          
          localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))
        }

        this.countPoints(likeComCase);
      },
      error: (e) => console.error(e),
      complete: () => this.tempLike = !this.tempLike
    })
  }

  // Dislike the comment and update the local storage
  onDislikeComment() {
    var comId = this.com.id
    this.CommentsService.disikeAComment(comId)
    .subscribe({
      next: (v) => {
        let objDislikeCom = v;
        let dislikeComCase = "";

        if (Object.values(objDislikeCom).find(i => i == "Je n'aime pas ce commentaire")) {
          document.getElementById(`likeCom-${comId}`)!.style.color = 'black'
          document.getElementById(`dislikeCom-${comId}`)!.style.color = 'darkred'
          dislikeComCase = 'dislike';

        } else if (Object.values(objDislikeCom).find(i => i == "Je supprime mon dislike")) {
          document.getElementById(`likeCom-${comId}`)!.style.color = 'black'
          document.getElementById(`dislikeCom-${comId}`)!.style.color = 'black'
          dislikeComCase = 'undislike';

        } else {
          document.getElementById(`likeCom-${comId}`)!.style.color = 'black'
          document.getElementById(`dislikeCom-${comId}`)!.style.color = 'darkred'
          dislikeComCase = 'changed to dislike';
        }

        let dislikeBody = Object.values(objDislikeCom)[1]

        if (dislikeBody != undefined) {
          var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
          var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);
  
          comFound.ComLikes = [dislikeBody]
          
          localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))
        } else {
          var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
          var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);
  
          comFound.ComLikes = []
          
          localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))
        }

        this.countPoints(dislikeComCase);
      },
      error: (e) => console.error(e),
      complete: () => {        
        this.tempDislike = !this.tempDislike
      }
    })
  }

  // Count the points of the comment to display up-to-date points without reloading the page
  countPoints(userCase : string) {
    if (this.tempPoints == null || undefined) {
      this.tempPoints = this.com.points;
    }

    if (userCase == 'changed to like') {
      this.tempPoints = this.tempPoints + 2;
    } else if (userCase == 'like' || userCase == 'undislike') {
      this.tempPoints = this.tempPoints + 1;
    } else if (userCase == 'unlike' || userCase == 'dislike') {
      this.tempPoints = this.tempPoints - 1;
    } else {
      this.tempPoints = this.tempPoints -2;
    }

    document.getElementById(`pointsCom-${this.com.id}`)!.innerHTML = `${this.tempPoints}`

    var storedCom = JSON.parse(localStorage.getItem(`post-${this.com.postId}`)!);
    var comFound = storedCom.Com.find((waldo: any) => waldo.id == this.com.id);

    comFound.points = this.tempPoints;

    localStorage.setItem(`post-${this.com.postId}`, JSON.stringify(storedCom))
  }

  // Find if the current user liked or disliked the comment
  findRightUser() {
    var check = this.com.ComLikes.filter((l: any) => l.userId == this.userId)

    if(check.length > 0) {
      var isLiked = check.filter((i: any) => i.isLiked == true)
      if (isLiked.length > 0){
        return 'like'
      } else {
        return 'dislike'
      }
    } else {
      return false
    }
  }

  // Calculate the difference between the current date and the date of the comment
  calculateDiff(){
    let createdDate = new Date(this.com.createdAt);
    let currentDate = new Date();
    let timeDiff = currentDate.getTime() - createdDate.getTime();
    let diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
    let diffHours = Math.floor(timeDiff / (1000 * 3600)) - (diffDays * 24);
    let diffMinutes = Math.floor(timeDiff / (1000 * 60)) - (diffDays * 24 * 60) - (diffHours * 60);

    let response = "";
    if (diffDays == 1) {
      response = diffDays + " jour";
    } else if (diffDays > 1) {
      response = diffDays + " jours";
    } else if (diffHours == 1) {
      response = diffHours + " heure";
    } else if (diffHours > 1) {
      response = diffHours + " heures";
    } else if (diffMinutes == 1) {
      response = diffMinutes + " minute";
    } else if (diffMinutes > 1) {
      response = diffMinutes + " minutes";
    } else {
      response = "moins d'une minute";
    }

    return response;
  }

  // Send signal to the parent component ('comment updated' or 'close update component')
  triggeredFromChildren(eventData: any) {
    if(eventData.message == 'comment updated') {
      this.loadUpdateComment = !this.loadUpdateComment;
      this.ngOnInit();
      this.infoBox = {'infoMsg' : eventData.info, 'errorMsg' : eventData.error};

      (eventData.content != null)? this.com.content = eventData.content : null;
      (eventData.attachment != null)? this.com.attachment = eventData.attachment : null;
    }

    if(eventData.message == 'close update component') {
      this.loadUpdateComment = !this.loadUpdateComment;
    }
  }

  // Close all the chexbox menus except the one that was clicked
  closeOtherCheckboxes() {
    var dropdownCheckBox = document.getElementsByClassName("checkbox");
    // transform dropdown to array
    var dropdownArray = Array.prototype.slice.call(dropdownCheckBox);

    for (var i = 0; i < dropdownArray.length; i++) {
      if(dropdownArray[i].id != `dropdown-${this.com.id}`) {
        dropdownArray[i].checked = false;
      } else {
        if(dropdownArray[i].checked == true) {
          dropdownArray[i].checked = true;
        } else {
          dropdownArray[i].checked = false;
        }
      }
    }
  }
}
