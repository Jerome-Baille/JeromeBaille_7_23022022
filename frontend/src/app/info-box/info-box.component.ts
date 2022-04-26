import { Component, Input, OnInit } from '@angular/core';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  // Info variables (success, error, loading)
  errorMsg: string = "";
  infoMsg: any = "";
  @Input() infoBox!: any;

  // FontAwesome Icons
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;

  constructor() { }

  ngOnInit(): void {
    if (this.infoBox.errorMsg) {
      this.errorMsg = this.infoBox.errorMsg;
    } else if (this.infoBox.infoMsg) {
      this.infoMsg = this.infoBox.infoMsg;
    }
  }

  ngOnChanges(): void {
    this.reloadInfoBoxAnimation();
    this.ngOnInit();
  }

    // Reload the animation of the info box to show the info box again
    reloadInfoBoxAnimation() {
      // Get the info box thanks to its id
      var success = document.getElementById("success-box");

      if(success != null) {
        // Restart the animation that makes the info box disappear
        success!.style.animation = 'none';
        success!.offsetHeight; /* trigger reflow */
        success!.style.animation = "";
      }

      // Get the info box thanks to its id
      var error = document.getElementById("error-box");

      if(error != null) {
        // Restart the animation that makes the info box disappear
        error!.style.animation = 'none';
        error!.offsetHeight; /* trigger reflow */
        error!.style.animation = "";
      }
    }
}