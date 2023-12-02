import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Galaxy} from 'src/app/Interfaces/galaxy';
import {Universe} from 'src/app/Interfaces/universe';

interface dataDialog {
  galaxy: Galaxy,
  universeList: Universe[]
}

@Component({
  selector: 'app-galaxy-create-dialog',
  templateUrl: './galaxy-create-dialog.component.html',
  styleUrls: ['./galaxy-create-dialog.component.css']
})
export class GalaxyCreateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GalaxyCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataDialog) { }

    ngOnInit(): void {
      console.log(this.data);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
}
