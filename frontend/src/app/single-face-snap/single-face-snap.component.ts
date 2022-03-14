import { Component, OnInit } from '@angular/core';
import { FaceSnap, User } from '../models/blog.model';
import { FaceSnapsService } from '../services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-single-face-snap',
  templateUrl: './single-face-snap.component.html',
  styleUrls: ['./single-face-snap.component.scss']
})
export class SingleFaceSnapComponent implements OnInit {
  faceSnap$!: Observable<FaceSnap>;
  faceUser$!: Observable<User>;
  buttonText!: string;

  constructor(private faceSnapsService: FaceSnapsService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.buttonText = 'Oh Snap!';
    const snapId = +this.route.snapshot.params['id'];
    this.faceSnap$ = this.faceSnapsService.getFaceSnapById(snapId); 
  }


  onSnap() {
    // if (this.buttonText === 'Oh Snap!') {
    //     this.faceSnapsService.snapFaceSnapById(this.faceSnap.id, 'snap');
    //     this.buttonText = 'Oops, unSnap!';
    // } else {
    //     this.faceSnapsService.snapFaceSnapById(this.faceSnap.id, 'unsnap');
    //     this.buttonText = 'Oh Snap!';
    // }
  }
}
