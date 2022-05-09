import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.scss']
})
export class MostPopularComponent implements OnInit {
  // Get info from parent component
  @Input() post!: Post;

  constructor() { }

  ngOnInit(): void {
  }

  // Calculate the time difference between now and the post creation date
  calculateDiff(){
    let createdDate = new Date(this.post.createdAt);
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
}
