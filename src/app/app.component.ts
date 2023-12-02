import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selected = new FormControl(0);
  popUpMsg = '';
  title = 'starview';

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndex');
    if (savedTabIndex !== null) {
      this.selected.setValue(+savedTabIndex);
    }
  }

  showPopup(msg: string) {
    this.popUpMsg = msg;
    setTimeout(() => {
      this.popUpMsg = '';
    }, 1500);
  }

  onTabChange(index: number) {
    this.selected.setValue(index);
    localStorage.setItem('selectedTabIndex', index.toString());
  }
}
