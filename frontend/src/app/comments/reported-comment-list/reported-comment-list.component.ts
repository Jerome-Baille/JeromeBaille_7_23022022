import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-reported-comment-list',
  templateUrl: './reported-comment-list.component.html',
  styleUrls: ['./reported-comment-list.component.scss']
})
export class ReportedCommentListComponent implements OnInit {
  @Input() infoFromDashboard: any = {};
  
  @Output() reportedCommentListEvent: EventEmitter<any> = new EventEmitter<any>();

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;

  // Info variables (loading)
  loading: boolean = true;

  // Main data variables
  comments: any = [];
  totalComments!: number;


  constructor(
    private commentsService: CommentsService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get the main infos (total comments, user id and role of the user) from the dashboard
    this.totalComments = this.infoFromDashboard.totalComments
    this.userId = this.infoFromDashboard.userId;
    this.isAdmin = this.infoFromDashboard.isAdmin;

    // Load 5 first reported comments
    this.loadReportedComs()

    this.loading = false;
  }

  // Get 5 reported comments
  loadReportedComs() {
    let date = new Date();
    let ExpInTen = date.setMinutes(date.getMinutes() + 10);
    
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt,postId';
    var limit = '5';
    var offset = '*';
    var order = 'createdAt:DESC';

    this.commentsService.getReportedComments(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        this.comments = v
      },
      error: (e) => console.error(e),
    })
  }

  loadMoreReportedComs() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt,postId';
    var limit = '5';
    var offset = this.comments.length;
    var order = 'createdAt:DESC';

    this.commentsService.getReportedComments(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        if(v.length != 0) {
          this.comments = this.comments.concat(v);
          console.log('loading more comments')
          }
      },
      error: (e) => console.error(e),
    })
  }

  triggeredFromChildren(eventData: any) {
    if(eventData.message == 'comment removed') {
      this.reportedCommentListEvent.emit(eventData);
      this.comments.length--;
      this.totalComments--;
    } 
  }
}