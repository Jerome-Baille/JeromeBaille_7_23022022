import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/blog.model';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit {
  comments$!: Observable<Comment[]>;

  constructor(
    private route: ActivatedRoute,
    private CommentsService: CommentsService
  ) { }

  ngOnInit(): void {
    const postId = +this.route.snapshot.params['id'];
    this.comments$ = this.CommentsService.getPostComments(postId);
  }

}
