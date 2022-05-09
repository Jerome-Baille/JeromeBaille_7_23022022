import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-reported-post-list',
  templateUrl: './reported-post-list.component.html',
  styleUrls: ['./reported-post-list.component.scss']
})
export class ReportedPostListComponent implements OnInit {
  // Get the main infos (total posts, user id and role of the user) from the dashboard
  @Input() infoFromDashboard: any = {};

  @Output() reportedPostListEvent: EventEmitter<any> = new EventEmitter<any>();

  // Get current user id and role (admin or not)
  userId!: any;
  isAdmin: boolean = false;

  // Main data variables
  posts!: any;
  totalPosts!: number;

  // Info variables (loading)
  loading: boolean = true;

  constructor(
    private postsService: PostsService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get the main infos (total comments, user id and role of the user) from the dashboard
    this.totalPosts = this.infoFromDashboard.totalPosts
    this.userId = this.infoFromDashboard.userId;
    this.isAdmin = this.infoFromDashboard.isAdmin;

    // Load 5 first reported posts
    this.loadReportedPosts();

    this.loading = false;
  }

  // Get 5 reported posts
  loadReportedPosts() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
    var limit = '5';
    var offset = '*';
    var order = 'createdAt:DESC';

    this.postsService.getReportedPosts(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        this.posts = v;
      },
      error: (e) => console.error(e),
    })
  }


  loadMoreReportedPosts() {
    var fields = 'id,content,attachment,isSignaled,points,createdAt,updatedAt';
    var limit = '5';
    var offset = this.posts.length;
    var order = 'createdAt:DESC';
    
    this.postsService.getReportedPosts(fields, limit, offset, order)
    .subscribe({
      next: (v) => {
        if(v.length != 0) {
        this.posts = this.posts.concat(v);
        console.log('loading more posts')
        }
      },
      error: (e) => console.log(e),
    })
  }

  triggeredFromChildren(eventData: any) {
    switch (eventData.message) {
      case 'post removed':
        this.reportedPostListEvent.emit(eventData);
        this.totalPosts--;
        this.posts.length--;
        break;
    }
  }
}