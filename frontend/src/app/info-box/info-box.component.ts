import { Component, Input, OnInit } from '@angular/core';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
  // Info variables (success, error, loading)
  @Input() infoBox!: any;
  errorMsg: string = "";
  infoMsg: any = "";
  origin: any = null;
  id: any = null;

  // FontAwesome Icons
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;

  constructor() { }

  ngOnInit(): void {
    if (this.infoBox.errorMsg) {
      this.errorMsg = this.infoBox.errorMsg;
      this.origin = this.infoBox.origin;
      this.id = this.infoBox.id;
    } else if (this.infoBox.infoMsg) {
      this.infoMsg = this.infoBox.infoMsg;
      this.origin = this.infoBox.origin;
      this.id = this.infoBox.id;
    }
  }

  ngOnChanges(): void {
    if (this.infoBox.errorMsg || this.infoBox.infoMsg) {
      this.reloadInfoBoxAnimation();
      this.ngOnInit();
    }
  }

  // Reload the animation of the info box to show the info box again
  reloadInfoBoxAnimation() {
    // Get the info box thanks to its id
    var success = document.getElementById(`success-box-${this.origin}-${this.id}`);

    if(success != null && this.infoBox.infoMsg) {
      // Restart the animation that makes the info box disappear
      success!.style.animation = 'none';
      success!.offsetHeight; /* trigger reflow */
      success!.style.animation = "";
    }

    // Get the info box thanks to its id
    var error = document.getElementById(`error-box-${this.origin}-${this.id}`);

    if(error != null && this.infoBox.errorMsg) {
      // Restart the animation that makes the info box disappear
      error!.style.animation = 'none';
      error!.offsetHeight; /* trigger reflow */
      error!.style.animation = "";
    }
  }
}