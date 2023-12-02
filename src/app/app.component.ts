import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selected = new FormControl(0);
  popUpMsg = '';
  title = 'starview';

  showPopup(msg: string) {
    this.popUpMsg = msg;
    setTimeout(() => {
      this.popUpMsg = '';
    }, 1500)
  }
}
